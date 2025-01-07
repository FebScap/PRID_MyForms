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
                
                // On décrémente l'idx des questions suivantes
                var questions = await context.Questions.Where(q => q.FormId == question.FormId && q.IdX > question.IdX).ToListAsync();
                foreach (var q in questions) {
                    q.IdX--;
                }
                
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
            
            // Mapper les données du DTO vers l'entité
            mapper.Map<QuestionDTO, Question>(dto, question);
            
            var result = await new QuestionValidator(context).ValidateAsync(question);
            Console.WriteLine(result.Errors);
            if (!result.IsValid)
                return BadRequest(result);
            
            // Si l'idx a changé, on doit mettre à jour l'idx de l'autre question
            if (oldIdx != dto.IdX) {
                var otherQuestion = await context.Questions.FirstOrDefaultAsync(q => q.IdX == question.IdX && q.FormId == question.FormId);
                otherQuestion.IdX = oldIdx;
            }
            
            // Sauve les changements
            await context.SaveChangesAsync();
            // Retourne un statut 204 avec une réponse vide
            return NoContent();
        }
    }
}