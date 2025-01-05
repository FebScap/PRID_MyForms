using FluentValidation;
using Microsoft.EntityFrameworkCore;
using prid_2425_f02.Helpers;

namespace prid_2425_f02.Models;

public class UserValidator : AbstractValidator<User>
{
    private readonly Context _context;

    public UserValidator(Context context) {
        _context = context;

        RuleFor(u => u.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(255);

        RuleFor(u => u.Password)
            .NotEmpty()
            .MinimumLength(3)
            .MaximumLength(10);

        RuleFor(u => u.FirstName)
            .MinimumLength(3)
            .MaximumLength(50);

        RuleFor(u => u.LastName)
            .MinimumLength(3)
            .MaximumLength(50);

        RuleFor(u => u.Role)
            .IsInEnum();

        RuleFor(u => u.BirthDate)
            .LessThan(DateTime.Today)
            .DependentRules(() => {
                RuleFor(u => u.Age)
                    .LessThanOrEqualTo(125)
                    .GreaterThanOrEqualTo(18);
            });

        // Validations spécifiques pour la création
        RuleSet("create", () => {
            RuleFor(u => u.Email)
                .MustAsync(BeUniqueMail)
                .OverridePropertyName(nameof(User.Email))
                .WithMessage("'{PropertyName}' must be unique");

            RuleFor(u => new { u.FirstName, u.LastName })
                .MustAsync((u, token) => BeUniqueFullName(u.FirstName, u.LastName, token))
                .WithMessage("This full name already exists");

            /*RuleFor(u => new { u.FirstName, u.LastName })
                .Must((u) => !(string.IsNullOrEmpty(u.FirstName) && string.IsNullOrEmpty(u.LastName)))
                .WithMessage("At least one of your first or last name must be specified");*/
        });

        // Validations spécifiques pour l'authentification
        RuleSet("authenticate", () => {
            RuleFor(m => m.Token)
                .NotNull().OverridePropertyName("Password").WithMessage("Incorrect password.");
        });
    }

    public async Task<FluentValidation.Results.ValidationResult> ValidateOnCreate(User user) {
        return await this.ValidateAsync(user, o => o.IncludeRuleSets("default", "create"));
    }

    public async Task<FluentValidation.Results.ValidationResult> ValidateForAuthenticate(User? user) {
        if (user == null)
            return ValidatorHelper.CustomError("User not found.", "Id");
        return await this.ValidateAsync(user!, o => o.IncludeRuleSets("authenticate"));
    }

    private async Task<bool> BeUniqueMail(string mail, CancellationToken token) {
        return !await _context.Users.AnyAsync(u => u.Email == mail, token);
    }

    private async Task<bool> BeUniqueFullName(string? firstName, string? lastName, CancellationToken token) {
        return !await _context.Users.AnyAsync(u => u.FirstName == firstName && u.LastName == lastName, token);
    }
}