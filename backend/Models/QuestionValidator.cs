using FluentValidation;

namespace prid_2425_f02.Models
{
    public class QuestionValidator : AbstractValidator<Question>
    {
        private readonly Context _context;
        
        public QuestionValidator(Context context) {
            _context = context;
            
            RuleFor(q => q.Id)
                .NotEmpty();

            RuleFor(q => q.IdX)
                .NotEmpty();

            RuleFor(q => q.Title)
                .NotEmpty()
                .MaximumLength(255);

            RuleFor(q => q.Type)
                .IsInEnum();
        }
    }
}