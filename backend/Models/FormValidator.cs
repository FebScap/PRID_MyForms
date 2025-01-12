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

        RuleFor(f => f.IsPublic)
            .NotNull();

        RuleFor(f => f.OwnerId)
            .NotNull();
    }
    
    public async Task<FluentValidation.Results.ValidationResult> ValidateOnCreate(Form form) {
        return await this.ValidateAsync(form, o => o.IncludeRuleSets("default", "create"));
    }
}