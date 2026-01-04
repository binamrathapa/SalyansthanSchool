using FluentValidation;
using SalyanthanSchool.Core.DTOs.Invoice;

namespace SalyanthanSchool.Core.Validators
{
    public class PaymentRequestValidator : AbstractValidator<PaymentRequestDto>
    {
        public PaymentRequestValidator()
        {
            RuleFor(x => x.InvoiceId)
                .GreaterThan(0).WithMessage("A valid Invoice ID is required.");

            RuleFor(x => x.AmountPaid)
                .GreaterThan(0).WithMessage("Payment amount must be greater than zero.");

            RuleFor(x => x.PaymentModeId)
                .NotEmpty().WithMessage("Please specify a payment mode (Cash, Online, etc.).");

            RuleFor(x => x.PaymentDate)
                .LessThanOrEqualTo(DateTime.Now).WithMessage("Payment date cannot be in the future.");

            RuleFor(x => x.TransactionId)
                .MaximumLength(50).WithMessage("Transaction ID is too long.");
        }
    }
}