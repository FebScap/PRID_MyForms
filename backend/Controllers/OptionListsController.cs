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
        /*[HttpGet]
        public async Task<ActionResult<IEnumerable<OptionListDTO>>> GetAll()
        {
            // Récupérer toutes les listes d'options (système et utilisateur)
            var optionLists = await context.OptionsLists
                .Include(ol => ol.Options) // Inclut les options si nécessaire              //A FIX
                .ToListAsync();

            // Mapper les données en DTO
            var mappedOptionLists = optionLists.Select(ol => new OptionListDTO
            {
                Id = ol.Id,
                Name = ol.Name,
                IsSystem = ol.IsSystem,
                Options = ol.Options.Select(o => new OptionDTO
                {
                    Id = o.Id,
                    Value = o.Value
                }).ToList()
            }).ToList();

            return Ok(mappedOptionLists);
        }*/
    }
}