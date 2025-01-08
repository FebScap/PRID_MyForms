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
    public class InstancesController (Context context, IMapper mapper) : ControllerBase
    {
        [HttpGet("{id:int}")]
        public async Task<ActionResult<InstanceDTO>> GetById(int id) {
            var instance = await context.Instances.FindAsync(id);
            if (instance == null) return NotFound();
            return mapper.Map<InstanceDTO>(instance);
        }
        
        [HttpGet("{instanceId:int}/answers")]
        public async Task<ActionResult<AnswerDTO[]>> GetAnswers(int instanceId) {
            var answers = await context.Answers
                .Where(a => a.InstanceId == instanceId)
                .ToArrayAsync();
        
            return mapper.Map<AnswerDTO[]>(answers);
        }
    }
}