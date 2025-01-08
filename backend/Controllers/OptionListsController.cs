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
    }
}