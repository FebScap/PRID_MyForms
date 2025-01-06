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
        if (!HasAccessEditor(form, Convert.ToInt32(User.Identity?.Name))) return Forbid("You are not allowed to edit this form");
        
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
            if (!HasAccessEditor(f, Convert.ToInt32(User.Identity?.Name))) return Forbid("You are not allowed to edit this form");
            
            context.Forms.Remove(f);
            await context.SaveChangesAsync();
            return true;
        }
        return NotFound();
    }

    private bool HasAccessEditor(Form form, int userId) {
        return form.OwnerId == userId || form.Accesses.Any(a => a.UserId == userId && a.AccessType == AccessType.Editor);
    }
}