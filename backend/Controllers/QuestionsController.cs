using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using prid_2425_f02.Models;

namespace prid_2425_f02.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionsController (Context context, IMapper mapper) : ControllerBase
    {
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(int id) {
            var question = await context.Questions.FindAsync(id);
            if (question != null) {
                context.Questions.Remove(question);
                await context.SaveChangesAsync();
                return true;
            }
            return NotFound();
        }
    }
}