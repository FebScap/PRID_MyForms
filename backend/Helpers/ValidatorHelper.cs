using FluentValidation.Results;

namespace prid_2425_f02.Helpers;

public static class ValidatorHelper
{
    public static FluentValidation.Results.ValidationResult CustomError(string error, string propertyName, object attemptedValue) {
        return new FluentValidation.Results.ValidationResult(new[] { new ValidationFailure(propertyName, error, attemptedValue) });
    }

    public static FluentValidation.Results.ValidationResult CustomError(string error, string propertyName) {
        return new FluentValidation.Results.ValidationResult(new[] { new ValidationFailure(propertyName, error) });
    }
}
