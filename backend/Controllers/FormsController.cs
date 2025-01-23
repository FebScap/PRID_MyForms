using AutoMapper;
using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using prid_2425_f02.Helpers;
using prid_2425_f02.Models;
using System.Text.Json.Nodes;

namespace prid_2425_f02.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class FormsController(Context context, IMapper mapper) : ControllerBase
{
    [Authorized(Role.Admin)]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<FormDTO>>> GetAll() {
        // Récupère une liste de tous les forms et utilise le mapper pour les transformer en leur DTO
        return mapper.Map<List<FormDTO>>(
            await context.Forms
                .Include(f => f.Owner)
                .Include(f => f.Instances)
                .Include(f => f.Accesses)
                .Include(f => f.Questions)
                .ToListAsync()
        );
    }

    [HttpGet("user/{userId:int}")]
    public async Task<ActionResult<IEnumerable<FormDTO>>> GetAllByUser(int userId) {
        var isAdmin = User.IsInRole(Role.Admin.ToString());
        if (!isAdmin && userId.ToString() != User.Identity?.Name) return Forbid();

        return mapper.Map<List<FormDTO>>(
            await context.Forms
                .Where(f => f.Accesses.Any(ac => ac.UserId == userId) || f.OwnerId == userId)
                .Include(f => f.Owner)
                .Include(f => f.Instances)
                .Include(f => f.Accesses)
                .Include(f => f.Questions)
                .ToListAsync()
        );
    }

    [HttpGet("public")]
    public async Task<ActionResult<IEnumerable<FormDTO>>> GetAllPublic() {
        return mapper.Map<List<FormDTO>>(
            await context.Forms
                .Where(f => f.IsPublic == true)
                .Include(f => f.Owner)
                .Include(f => f.Questions)
                .ToListAsync()
        );
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<FormDTO>> GetById(int id) {
        var form = await context.Forms
            .Include(f => f.Owner)
            .Include(f => f.Instances).ThenInclude(i => i.User)
            .Include(f => f.Accesses)
            .Include(f => f.Questions.OrderBy(q => q.IdX))
            .FirstOrDefaultAsync(f => f.Id == id);
        if (form == null) return NotFound();
        return mapper.Map<FormDTO>(form);
    }

    [HttpPost]
    public async Task<ActionResult<FormDTO>> Create(FormDTO dto) {
        var form = mapper.Map<Form>(dto);
        form.OwnerId = Convert.ToInt32(User.Identity?.Name);
        form.Owner = await context.Users.FindAsync(form.OwnerId);

        // Vérifie si l'utilisateur a le droit de créer un form
        if (!HasAccessEditor(form, form.OwnerId)) return Forbid();

        // Valide le form
        var validator = new FormValidator(context);
        ValidationResult results = await validator.ValidateOnCreate(form);
        if (!results.IsValid) return BadRequest(results.Errors);

        context.Forms.Add(form);
        await context.SaveChangesAsync();
        return mapper.Map<FormDTO>(form);
    }

    [HttpPut]
    public async Task<ActionResult<FormDTO>> Update(FormDTO dto) {
        var form = await context.Forms
            .Include(f => f.Accesses)
            .Include(f => f.Questions)
            .FirstOrDefaultAsync(f => f.Id == dto.Id);

        if (form == null) return NotFound();

        // Vérification des droits d'accès : l'utilisateur doit avoir un accès éditeur
        if (!HasAccessEditor(form, Convert.ToInt32(User.Identity?.Name))) return Forbid();

        // Mise à jour des propriétés simples
        form.Title = dto.Title;
        form.Description = dto.Description;
        form.IsPublic = dto.IsPublic;

        // Gestion des accès si le formulaire devient public
        if (dto.IsPublic) {
            var userAccesses = form.Accesses.Where(a => a.AccessType == AccessType.User).ToList();
            userAccesses.ForEach(a => context.Accesses.Remove(a)); // Supprimer les accès utilisateurs spécifiques
        }

        // Gestion des questions associées
        form.Questions.Clear(); // On vide la liste des questions existantes pour la remplacer
        foreach (var questionDto in dto.Questions) {
            var question = mapper.Map<Question>(questionDto);
            question.FormId = form.Id; // S'assurer que chaque question est associée au formulaire
            form.Questions.Add(question);
        }

        // Gestion des accès (si nécessaires, pour modifications précises)
        form.Accesses = dto.Accesses.Select(a => mapper.Map<Access>(a)).ToList();

        // Sauvegarde des modifications en base de données
        await context.SaveChangesAsync();

        return mapper.Map<FormDTO>(form);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<bool>> Delete(int id) {
        var f = await context.Forms.FindAsync(id);

        if (f != null) {
            f.Accesses = await context.Accesses.Where(a => a.FormId == f.Id).ToListAsync();
            if (!HasAccessEditor(f, Convert.ToInt32(User.Identity?.Name)))
                return Forbid();

            context.Forms.Remove(f);
            await context.SaveChangesAsync();
            return true;
        }

        return NotFound();
    }

    [HttpPost("new_instance")]
    public async Task<ActionResult<InstanceDTO>> CreateInstance(FormDTO dto) {
        var f = await context.Forms.FindAsync(dto.Id);

        if (f != null) {
            f.Accesses = await context.Accesses.Where(a => a.FormId == f.Id).ToListAsync();
            // Vérifie si l'utilisateur a le droit de modifier le form
            if (!HasAccessReader(f, Convert.ToInt32(User.Identity?.Name)))
                return Forbid();

            Instance instance = new Instance {
                FormId = f.Id,
                UserId = Convert.ToInt32(User.Identity?.Name),
                Started = DateTimeOffset.Now
            };
            context.Instances.Add(instance);
            await context.SaveChangesAsync();
            return mapper.Map<InstanceDTO>(instance);
        }

        return NotFound();
    }

    [AllowAnonymous]
    [HttpGet("is-title-unique")]
    public async Task<ActionResult<bool>> IsTitleUnique([FromQuery] string title, [FromQuery] int ownerId,
        [FromQuery] int? currentFormId = null) {
        // Vérifie si les paramètres nécessaires sont fournis
        if (string.IsNullOrWhiteSpace(title) || ownerId <= 0) {
            return BadRequest("Title and ownerId are required.");
        }

        // Vérifie si un formulaire avec le même titre existe déjà pour ce propriétaire, en excluant le formulaire courant
        var isUnique = !await context.Forms.AnyAsync(f =>
            f.Title == title && f.OwnerId == ownerId && (currentFormId == null || f.Id != currentFormId));

        return Ok(isUnique);
    }


    private bool HasAccessEditor(Form form, int userId) {
        return form.OwnerId == userId ||
               form.Accesses.Any(a => a.UserId == userId && a.AccessType == AccessType.Editor);
    }

    private bool HasAccessReader(Form form, int userId) {
        return form.OwnerId == userId || form.Accesses.Any(a => a.UserId == userId) || form.IsPublic;
    }

    [HttpGet("{formId:int}/{questionId:int}/analyze")]
    public async Task<ActionResult<List<AnswerDTO>>> Analyze(int formId, int questionId) {
        var question = context.Questions.FirstOrDefault(q => q.Id == questionId);
        if (question == null) return NotFound();

        var instances = context.Instances.Include(i => i.Answers).Where(i => i.Completed.HasValue && i.FormId == formId)
            .ToList();
        if (instances.Count == 0) return NotFound();

        List<AnswerDTO> answers = new List<AnswerDTO>();
        foreach (var instance in instances) {
            foreach (var answer in instance.Answers) {
                if (answer.QuestionId == questionId) {
                    answers.Add(mapper.Map<AnswerDTO>(answer));
                }
            }
        }

        return answers;
    }
}