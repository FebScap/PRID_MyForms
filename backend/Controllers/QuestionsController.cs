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
        
        [HttpPut]
        public async Task<IActionResult> PutQuestion(QuestionDTO dto) {
            Question? question = await context.Questions.FindAsync(dto.Id);
            
            if (question == null)
                return NotFound();
            int oldIdx = question.IdX;
            
            mapper.Map<QuestionDTO, Question>(dto, question);
            var result = await new QuestionValidator(context).ValidateAsync(question);
            Console.WriteLine(result.Errors);
            if (!result.IsValid)
                return BadRequest(result);
            
            if (oldIdx != dto.IdX) {
                var otherQuestion = await context.Questions.FirstOrDefaultAsync(q => q.IdX == question.IdX && q.FormId == question.FormId);
                otherQuestion.IdX = oldIdx;
                Console.WriteLine(question.Title + " " + question.IdX);
                Console.WriteLine(otherQuestion.Title + " " + otherQuestion.IdX);
            }
            
            // Sauve les changements
            await context.SaveChangesAsync();
            // Retourne un statut 204 avec une réponse vide
            return NoContent();
        }
    }
}