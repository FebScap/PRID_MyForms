using FluentValidation;

namespace prid_2425_f02.Models
{
    public class QuestionValidator : AbstractValidator<Question>
    {
        private readonly FormContext _context;
        
        public QuestionValidator(FormContext context) {
            _context = context;

            RuleFor(q => q.Form)
                .NotEmpty(); 
            
            RuleFor(q => q.Id)
                .NotEmpty();

            RuleFor(q => q.IdX)
                .NotEmpty();

            RuleFor(q => q.Title)
                .NotEmpty()
                .MaximumLength(255);

            RuleFor(q => q.Type)
                .IsInEnum();

            RuleFor(q => q.Required)
                .NotEmpty();
        }
    }
}