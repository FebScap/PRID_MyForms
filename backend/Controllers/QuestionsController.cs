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
        public async Task<ActionResult<QuestionDTO>> Create(QuestionDTO questionDto) {
            // Valider si le DTO est null
            if (questionDto == null)
                return BadRequest("Question data is required.");

            // Récupérer le formulaire auquel appartient la question
            var form = await context.Forms
                .Include(f => f.Instances)
                .FirstOrDefaultAsync(f => f.Id == questionDto.FormId);

            if (form == null)
                return NotFound($"Form with ID {questionDto.FormId} not found.");

            // Vérifier si le formulaire a des instances existantes
            if (form.Instances.Any())
                return BadRequest("Cannot add or edit questions for forms with existing submissions.");

            // Vérifier si le titre est unique pour ce formulaire
            var titleExists = await context.Questions
                .AnyAsync(q => q.FormId == questionDto.FormId && q.Title == questionDto.Title);

            if (titleExists)
                return BadRequest("A question with the same title already exists in this form.");

            // Vérifier si l'indice (IdX) est unique pour ce formulaire
            var IdXExists = await context.Questions
                .AnyAsync(q => q.FormId == questionDto.FormId && q.IdX == questionDto.IdX);

            if (IdXExists)
                return BadRequest("A question with the same index already exists in this form.");

            // Vérifier si le type nécessite une liste d'options
            if (new[] { "check", "combo", "radio" }.Contains(questionDto.Type)) {
                if (questionDto.OptionList == null)
                    return BadRequest("Option list is required for the selected question type.");

                // Vérifier si la liste d'options existe
                var optionListExists = await context.OptionLists.AnyAsync(ol => ol.Id == questionDto.OptionList);
                if (!optionListExists)
                    return BadRequest($"Option list with ID {questionDto.OptionList} does not exist.");
            } else {
                // S'assurer que la liste d'options est null pour les types qui ne la nécessitent pas
                questionDto.OptionList = null;
            }

            // Mapper le DTO vers l'entité
            var question = mapper.Map<Question>(questionDto);

            // Ajouter la question à la base de données
            context.Questions.Add(question);
            await context.SaveChangesAsync();

            // Retourner la question créée
            return CreatedAtAction(nameof(GetById), new { id = question.Id }, mapper.Map<QuestionDTO>(question));
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
                .Include(q => q.OptionList)
                .FirstOrDefaultAsync(q => q.Id == id);

            if (question == null) return NotFound();

            return Ok(mapper.Map<QuestionDTO>(question));
        }
    }
}