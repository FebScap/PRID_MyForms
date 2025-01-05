using FluentValidation;

namespace prid_2425_f02.Models;

public class AnswerValidator : AbstractValidator<Answer>
{
    private readonly Context _context;

    public AnswerValidator(Context context) {
        _context = context;

        RuleFor(a => a.Instance)
            .NotEmpty();

        RuleFor(a => a.Question)
            .NotEmpty();

        RuleFor(a => a.Idx)
            .NotEmpty();

        RuleFor(a => a.Value)
            .NotEmpty();
    }
}