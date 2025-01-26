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
    public class AnswersController (Context context, IMapper mapper) : ControllerBase
    {
        [HttpPut]
        public async Task<ActionResult<bool>> UpdateAnswer(AnswerDTO dto)
        {
            var answer = await context.Answers.Where(a => a.InstanceId == dto.InstanceId && a.QuestionId == dto.QuestionId).FirstOrDefaultAsync();
            if (answer == null) return NotFound();
            answer.Value = dto.Value;
            await context.SaveChangesAsync();
            return true;
        }
        
        [HttpPost]
        public async Task<ActionResult<bool>> CreateAnswer(AnswerDTO dto)
        {
            var answer = mapper.Map<Answer>(dto);
            if (context.Answers.ToArray().Length == 0) {
                answer.Idx = 1;
            } else {
                answer.Idx = context.Answers.Max(a => a.Idx) + 1;
            }
            context.Answers.Add(answer);
            await context.SaveChangesAsync();
            return true;
        }
        
        [HttpDelete("{questionId}/{instanceId}")]
        public async Task<ActionResult<bool>> DeleteAnswer(int questionId, int instanceId)
        {
            var answer = await context.Answers.Where(a => a.InstanceId == instanceId && a.QuestionId == questionId).FirstOrDefaultAsync();
            if (answer == null) return NotFound();
            await context.SaveChangesAsync();
            return true;
        }
    }
}