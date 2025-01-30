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
    public class AccessController(Context context, IMapper mapper) : ControllerBase
    {
        [HttpGet("{formId}/accesses")]
        public async Task<ActionResult<IEnumerable<AccessDTO>>> GetAccesses(int formId)
        {
            var accesses = await context.Accesses
                .Where(ufa => ufa.FormId == formId)
                .Include(ufa => ufa.User) // Inclut les détails utilisateur
                .ToListAsync();

            return Ok(mapper.Map<List<AccessDTO>>(accesses));
        }
        
        [HttpPost("accesses")]
        public async Task<IActionResult> AddAccess([FromBody] AccessCreateDTO access)
        {

            if (access == null || access.UserId <= 0 || access.FormId <= 0 || !Enum.IsDefined(typeof(AccessType), access.AccessType))
            {
                return BadRequest("Invalid access data.");
            }

            // Vérifiez si l'accès existe déjà
            var existingAccess = await context.Accesses
                .FirstOrDefaultAsync(a => a.FormId == access.FormId && a.UserId == access.UserId);

            if (existingAccess != null)
            {
                return BadRequest("Access already exists for this user and form.");
            }

            // Ajoutez le nouvel accès
            var accessEntity = mapper.Map<Access>(access);
            context.Accesses.Add(accessEntity);
            await context.SaveChangesAsync();

            // Incluez les propriétés FirstName et LastName pour la réponse
            var user = await context.Users.FindAsync(access.UserId);

            var result = new AccessDTO
            {
                UserId = access.UserId,
                FormId = access.FormId,
                AccessType = access.AccessType,
                FirstName = user.FirstName,
                LastName = user.LastName
            };

            return Ok(result);
        }
        
        [HttpPut("{formId}/accesses/{userId}")]
        public async Task<IActionResult> UpdateAccess(int formId, int userId, AccessDTO dto)
        {
            var access = await context.Accesses
                .FirstOrDefaultAsync(ufa => ufa.FormId == formId && ufa.UserId == userId);

            if (access == null)
                return NotFound();

            var form = await context.Forms.FindAsync(formId);
            if (form == null)
                return NotFound();

            if (form.IsPublic && dto.AccessType == AccessType.User)
            {
                // Si le form est public et l'accès devient user seul, on supprime l'accès
                context.Accesses.Remove(access);
                await context.SaveChangesAsync();
                return NoContent();
            }

            access.AccessType = dto.AccessType;
            await context.SaveChangesAsync();

            return NoContent();
        }
        
        [HttpDelete("{formId}/accesses/{userId}")]
        public async Task<IActionResult> DeleteAccess(int formId, int userId)
        {
            var access = await context.Accesses
                .FirstOrDefaultAsync(ufa => ufa.FormId == formId && ufa.UserId == userId);

            if (access == null) return NotFound();

            context.Accesses.Remove(access);
            await context.SaveChangesAsync();

            return NoContent();
        }
        
        [HttpGet("{formId}/eligible-users")]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetEligibleUsers(int formId)
        {

            // Charger le formulaire avec son propriétaire
            var form = await context.Forms.Include(f => f.Owner).FirstOrDefaultAsync(f => f.Id == formId);
            if (form == null)
            {
                return NotFound();
            }
            
            // Récupérer les IDs des utilisateurs déjà dans la table Accesses pour ce formulaire
            var excludedUserIds = await context.Accesses
                .Where(a => a.FormId == formId)
                .Select(a => a.UserId)
                .ToListAsync();
            
            // Filtrer les utilisateurs éligibles (pas dans Accesses, pas admin, pas propriétaire)
            var eligibleUsers = await context.Users
                .Where(u =>
                    u.Id != form.OwnerId &&               // Exclure le propriétaire
                    u.Role != Role.Admin &&               // Exclure les admins
                    u.Role != Role.Guest &&               // Eclure les Guests
                    !excludedUserIds.Contains(u.Id))      // Exclure ceux déjà dans Accesses
                .ToListAsync();
            
            return Ok(mapper.Map<List<UserDTO>>(eligibleUsers));
        }

    }
}