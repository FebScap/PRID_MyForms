using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using prid_2425_f02.Helpers;
using prid_2425_f02.Models;

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
                .ToListAsync()
            );
    }
    
    [HttpGet("public")]
    public async Task<ActionResult<IEnumerable<FormDTO>>> GetAllPublic() {
        return mapper.Map<List<FormDTO>>(
            await context.Forms
                .Where(f => f.IsPublic == true)
                .Include(f => f.Owner)
                .ToListAsync()
            );
    }
    
    [HttpGet("{id:int}")]
    public async Task<ActionResult<FormDTO>> GetById(int id) {
        var form = await context.Forms
            .Include(f => f.Owner)
            .Include(f => f.Instances)
            .Include(f => f.Accesses)
            .Include(f => f.Questions.OrderBy(q=> q.IdX))
            .FirstOrDefaultAsync(f => f.Id == id);
        if (form == null) return NotFound();
        return mapper.Map<FormDTO>(form);
    }
    
    [HttpPut]
    public async Task<ActionResult<FormDTO>> Update(FormDTO dto) {
        var form = await context.Forms.FindAsync(dto.Id);
        
        if (form == null) return NotFound();
        
        // Vérifie si l'utilisateur a le droit de modifier le form
        form.Accesses = await context.Accesses.Where(a => a.FormId == form.Id).ToListAsync();
        if (!HasAccessEditor(form, Convert.ToInt32(User.Identity?.Name))) return Forbid();
        
        // Pour le toggle public
        if (form.IsPublic != dto.IsPublic) {
            form.IsPublic = dto.IsPublic;
            
            // Si le form devient public, on supprime tous les accès lecture
            if (dto.IsPublic) {
                var accesses = await context.Accesses.Where(a => a.FormId == form.Id && a.AccessType == AccessType.User).ToListAsync();
                accesses.ForEach(a => {
                    context.Accesses.Remove(a);
                });
            }
        }
        
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
    public async Task<ActionResult<bool>> IsTitleUnique([FromQuery] string title, [FromQuery] int ownerId)
    {
        // Vérifie si les paramètres nécessaires sont fournis
        if (string.IsNullOrWhiteSpace(title) || ownerId <= 0)
        {
            return BadRequest("Title and ownerId are required.");
        }

        // Vérifie si un formulaire avec le même titre existe déjà pour ce propriétaire
        var isUnique = !await context.Forms.AnyAsync(f => f.Title == title && f.OwnerId == ownerId);
    
        return Ok(isUnique);
    }
    
    private bool HasAccessEditor(Form form, int userId) {
        return form.OwnerId == userId || form.Accesses.Any(a => a.UserId == userId && a.AccessType == AccessType.Editor);
    }
    
    private bool HasAccessReader(Form form, int userId) {
        return form.OwnerId == userId || form.Accesses.Any(a => a.UserId == userId) || form.IsPublic;
    }
    
    [HttpPost]
    public async Task<ActionResult<FormDTO>> Create(FormDTO formDto)
    {
        Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(formDto));
        Console.WriteLine("debug");
        if (formDto == null)
            return BadRequest("formDto is required.");

        var form = new Form
        {
            Title = formDto.Title,
            Description = formDto.Description,
            IsPublic = formDto.IsPublic,
            OwnerId = formDto.Owner.Id 
        };

        context.Forms.Add(form);
        await context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = form.Id }, mapper.Map<FormDTO>(form));
    }



}