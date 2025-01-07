using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using prid_2425_f02.Models;

namespace prid_2425_f02.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class InstancesController (Context context, IMapper mapper) : ControllerBase
    {
        [HttpGet("{id:int}")]
        public async Task<ActionResult<InstanceDTO>> GetById(int id) {
            var instance = await context.Instances.FindAsync(id);
            if (instance == null) return NotFound();
            return mapper.Map<InstanceDTO>(instance);
        }
    }
}