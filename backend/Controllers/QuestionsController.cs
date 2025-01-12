using AutoMapper;
using FluentValidation.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid_2425_f02.Models;
using System.Text.Json;

namespace prid_2425_f02.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionsController(Context context, IMapper mapper) : ControllerBase
    {
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(int id) {
            var question = await context.Questions.FindAsync(id);
            if (question != null) {
                context.Questions.Remove(question);

                // On décrémente l'IdX des questions suivantes
                var questions = await context.Questions.Where(q => q.FormId == question.FormId && q.IdX > question.IdX)
                    .ToListAsync();
                foreach (var q in questions) {
                    q.IdX--;
                }

                await context.SaveChangesAsync();
                return true;
            }

            return NotFound();
        }

        [HttpPut]
        public async Task<IActionResult> PutQuestion(QuestionDTO dto) {
            Question? question = await context.Questions.FindAsync(dto.Id);

            if (question == null)
                return NotFound();
            int oldIdX = question.IdX;

            // Mapper les données du DTO vers l'entité
            mapper.Map<QuestionDTO, Question>(dto, question);

            var result = await new QuestionValidator(context).ValidateAsync(question);
            if (!result.IsValid)
                return BadRequest(result);

            // Si l'IdX a changé, on doit mettre à jour l'IdX de l'autre question
            if (oldIdX != dto.IdX) {
                var otherQuestion =
                    await context.Questions.FirstOrDefaultAsync(q =>
                        q.IdX == question.IdX && q.FormId == question.FormId);
                otherQuestion.IdX = oldIdX;
            }

            // Sauve les changements
            await context.SaveChangesAsync();
            // Retourne un statut 204 avec une réponse vide
            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<QuestionDTO>> Create(QuestionDTO dto)
        {
            // Afficher les données reçues pour débogage
            Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(dto));
            Console.WriteLine("Debug: Adding a new question");

            // Récupérer le formulaire auquel appartient la question
            var form = await context.Forms
                .Include(f => f.Instances)
                .FirstOrDefaultAsync(f => f.Id == dto.FormId);

            if (form == null)
            {
                return NotFound($"Form with ID {dto.FormId} not found.");
            }

            // Vérifier si le formulaire a des instances existantes
            if (form.Instances.Any())
            {
                return BadRequest("Cannot add questions to a form with existing submissions.");
            }

            // Créer une nouvelle question
            var question = new Question
            {
                Title = dto.Title,
                Description = dto.Description,
                Type = dto.Type,
                Required = dto.Required,
                IdX = dto.IdX, // Index de la question dans le formulaire
                FormId = dto.FormId,
                OptionList = dto.OptionList // Peut être null pour les types qui n'en nécessitent pas
            };

            // Valider la question avec un validateur
            ValidationResult result = await new QuestionValidator(context).ValidateOnCreate(question);
            if (!result.IsValid)
            {
                return BadRequest(result.Errors);
            }

            // Ajouter la question à la base de données
            context.Questions.Add(question);
            await context.SaveChangesAsync();

            // Retourner la réponse avec l'ID de la nouvelle question
            return CreatedAtAction(nameof(GetById), new { id = question.Id }, mapper.Map<QuestionDTO>(question));
        }

        
        // GET: api/questions/form/{formId}
        [HttpGet("form/{formId:int}")]
        public async Task<ActionResult<IEnumerable<QuestionDTO>>> GetByFormId(int formId)
        {
            var questions = await context.Questions
                .Where(q => q.FormId == formId)
                .OrderBy(q => q.IdX)
                .Include(q => q.OptionList)
                .ToListAsync();

            return Ok(mapper.Map<List<QuestionDTO>>(questions));
        }
        
        // GET: api/questions/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<QuestionDTO>> GetById(int id)
        {
            var question = await context.Questions
                .Include(q => q.OptionList)
                .FirstOrDefaultAsync(q => q.Id == id);

            if (question == null) return NotFound();

            return Ok(mapper.Map<QuestionDTO>(question));
        }
    }
}