using FluentValidation;
using SalyanthanSchool.Core.DTOs;


namespace SalyanthanSchool.Core.Validators
{
    public class RoutineValidator : AbstractValidator<RoutineDTO>
    {
        public RoutineValidator()
        {
            RuleFor(x => x.TimeSlot)
            .NotEmpty().WithMessage("Time Slot is required");


            RuleFor(x => x.Priority)
            .GreaterThan(0).WithMessage("Priority must be a positive number");
        }
    }
}