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
            Console.WriteLine(instanceId);
            var answers = await context.Answers
                .Where(a => a.InstanceId == instanceId)
                .ToArrayAsync();
            
            return mapper.Map<AnswerDTO[]>(answers);
        }
        
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<bool>> Delete(int id) {
            var instance = await context.Instances.FindAsync(id);
            if (instance == null) return NotFound();
            
            context.Instances.Remove(instance);
            await context.SaveChangesAsync();
            return true;
        }
        
        [HttpPut]
        public async Task<ActionResult<InstanceDTO>> Update(InstanceDTO dto) {
            var instance = await context.Instances.FindAsync(dto.Id);
            if (instance == null) return NotFound();
            
            mapper.Map(dto, instance);
            await context.SaveChangesAsync();
            return mapper.Map<InstanceDTO>(instance);
        }
    }
}