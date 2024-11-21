using FluentValidation;

namespace prid_2425_f02.Models;

public class AnswersValidator : AbstractValidator<Answer>
{
    private readonly FormContext _context;

    public AnswersValidator(FormContext context) {
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