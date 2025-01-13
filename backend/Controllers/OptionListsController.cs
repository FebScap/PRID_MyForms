using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid_2425_f02.Models;

namespace prid_2425_f02.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OptionListsController(Context context, IMapper mapper) : ControllerBase
    {
        [HttpGet("{id}")]
        public async Task<ActionResult<OptionListDTO>> GetOptionList(int id) {
            var optionList = await context.OptionsLists
                .Include(o => o.Values)
                .Where(o => o.Id == id)
                .FirstOrDefaultAsync();
            return mapper.Map<OptionListDTO>(optionList);
        }
        
        // GET: api/optionlists
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OptionListDTO>>> GetAll()
        {
            // Récupérer toutes les listes d'options (système et utilisateur)
            var optionLists = await context.OptionsLists
                .Include(ol => ol.Values) // Inclut les options si nécessaire             
                .ToListAsync();
            Console.WriteLine(optionLists);

            return Ok(mapper.Map<List<OptionListDTO>>(optionLists));
        }
        
        [HttpGet("user/{userId:int}")]
        public async Task<ActionResult<IEnumerable<OptionListDTO>>> GetAllByUser(int userId)
        {
            var isAdmin = User.IsInRole(Role.Admin.ToString());
            if (!isAdmin && userId.ToString() != User.Identity?.Name) return Forbid();
            // Récupérer toutes les listes d'options (système et utilisateur)
            var optionLists = await context.OptionsLists
                .Where(ol => ol.OwnerId == userId || ol.OwnerId == null)
                .ToListAsync();
            Console.WriteLine(optionLists);

            return Ok(mapper.Map<List<OptionListDTO>>(optionLists));
        }
        
        // POST: api/optionlists
        [HttpPost]
        public async Task<IActionResult> CreateOptionList(OptionListDTO dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest("Invalid data.");

            // Création de l'OptionList avec valeurs associées
            var optionList = new OptionList
            {
                Name = dto.Name,
                OwnerId = dto.OwnerId,
                Values = dto.Values.Select((v, idx) => new OptionValue { Label = v.Label, Idx = idx + 1 }).ToList()
            };

            context.OptionsLists.Add(optionList);
            await context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOptionList), new { id = optionList.Id }, mapper.Map<OptionListDTO>(optionList));
        }

        // PUT: api/optionlists/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateOptionList(int id, OptionListDTO dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest("Invalid data.");

            var optionList = await context.OptionsLists
                .Include(ol => ol.Values)
                .FirstOrDefaultAsync(ol => ol.Id == id);

            if (optionList == null)
                return NotFound($"Option list with ID {id} not found.");

            // Mise à jour du nom
            optionList.Name = dto.Name;

            // Mise à jour des valeurs
            optionList.Values.Clear();
            optionList.Values = dto.Values.Select((v, idx) => new OptionValue { Label = v.Label, Idx = idx + 1 }).ToList();

            await context.SaveChangesAsync();

            return NoContent();
        }
    }
}