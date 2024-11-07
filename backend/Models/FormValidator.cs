using FluentValidation;

namespace prid_2425_f02.Models;

public class FormValidator : AbstractValidator<Form>
{
    private readonly FormContext _context;

    public FormValidator(FormContext context) {
        _context = context;

        RuleFor(f => f.Title)
            .NotEmpty()
            .MaximumLength(255);

        RuleFor(f => f.Owner)
            .NotEmpty();

        RuleFor(f => f.IsPublic)
            .NotEmpty();
    }
}