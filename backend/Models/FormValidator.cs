using FluentValidation;

namespace prid_2425_f02.Models;

public class FormValidator : AbstractValidator<Form>
{
    private readonly Context _context;

    public FormValidator(Context context) {
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