using AutoMapper;
using FluentValidation.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid_2425_f02.Models;
using System.Text.Json;

namespace prid_2425_f02.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionsController(Context context, IMapper mapper) : ControllerBase
    {
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(int id) {
            var question = await context.Questions.FindAsync(id);
            if (question != null) {
                context.Questions.Remove(question);

                // On décrémente l'IdX des questions suivantes
                var questions = await context.Questions.Where(q => q.FormId == question.FormId && q.IdX > question.IdX)
                    .ToListAsync();
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
            int oldIdX = question.IdX;

            // Mapper les données du DTO vers l'entité
            mapper.Map<QuestionDTO, Question>(dto, question);

            var result = await new QuestionValidator(context).ValidateAsync(question);
            if (!result.IsValid)
                return BadRequest(result);

            // Si l'IdX a changé, on doit mettre à jour l'IdX de l'autre question
            if (oldIdX != dto.IdX) {
                var otherQuestion =
                    await context.Questions.FirstOrDefaultAsync(q =>
                        q.IdX == question.IdX && q.FormId == question.FormId);
                otherQuestion.IdX = oldIdX;
            }

            // Sauve les changements
            await context.SaveChangesAsync();
            // Retourne un statut 204 avec une réponse vide
            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<QuestionDTO>> Create(QuestionDTO dto) {
            var question = mapper.Map<Question>(dto);
            if (!context.Questions.Any(q => q.FormId == question.FormId)) {
                question.IdX = 1;
            } else {
                question.IdX = context.Questions.Where(q => q.FormId == question.FormId).Max(q => q.IdX) + 1;
            }
            //question. = Convert.ToInt32(User.Identity?.Name);
            //question.Owner = await context.Users.FindAsync(form.OwnerId);

            // Vérifie si l'utilisateur a le droit de créer un form
            //if (!HasAccessEditor(form, form.OwnerId)) return Forbid();

            // Valide le form
            var validator = new QuestionValidator(context);
            ValidationResult results = await validator.ValidateOnCreate(question);
            if (!results.IsValid) return BadRequest(results.Errors);

            context.Questions.Add(question);
            await context.SaveChangesAsync();
            return mapper.Map<QuestionDTO>(question);
        }

        
        // GET: api/questions/form/{formId}
        [HttpGet("form/{formId:int}")]
        public async Task<ActionResult<IEnumerable<QuestionDTO>>> GetByFormId(int formId)
        {
            var questions = await context.Questions
                .Where(q => q.FormId == formId)
                .OrderBy(q => q.IdX)
                .Include(q => q.OptionList)
                .ToListAsync();

            return Ok(mapper.Map<List<QuestionDTO>>(questions));
        }
        
        // GET: api/questions/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<QuestionDTO>> GetById(int id)
        {
            var question = await context.Questions
                .FirstOrDefaultAsync(q => q.Id == id);

            if (question == null) return NotFound();

            return Ok(mapper.Map<QuestionDTO>(question));
        }
    }
}