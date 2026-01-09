using FluentValidation;
using SalyanthanSchool.Core.DTOs.PaymentMode;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SalyanthanSchool.Core.Validators.PaymentMode
{
    public class PaymentModeRequestValidator : AbstractValidator<PaymentModeRequestDto>
    {
        // Allowed payment modes in Nepal
        private readonly List<string> allowedPaymentModes = new()
        {
            "Cash",
            "Bank",
            //"eSewa",
            //"Khalti",
            //"IME Pay",
            //"Card"
        };

        public PaymentModeRequestValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("Payment mode name is required.")

                .MaximumLength(50)
                .WithMessage("Payment mode name cannot exceed 50 characters.")

                .Must(name => allowedPaymentModes.Any(x => x.Equals(name, StringComparison.OrdinalIgnoreCase)))
                .WithMessage($"Payment mode must be one of the following: {string.Join(", ", allowedPaymentModes)}");
        }
    }
}
