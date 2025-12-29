using FluentValidation;
using SalyanthanSchool.Core.DTOs.ClassRoutine;
using SalyanthanSchool.Core.Entities; // To reference DayOfWeekEnum

namespace SalyanthanSchool.Core.Validators.ClassRoutine
{
    public class ClassRoutineRequestDtoValidator : AbstractValidator<ClassRoutineRequestDto>
    {
        public ClassRoutineRequestDtoValidator()
        {
            // FK Checks
            RuleFor(x => x.GradeId).GreaterThan(0).WithMessage("Grade ID is required.");
            RuleFor(x => x.SubjectId).GreaterThan(0).WithMessage("Subject ID is required.");
            RuleFor(x => x.TeacherId).GreaterThan(0).WithMessage("Teacher ID is required.");

            // SectionId is nullable, so no GreaterThan check needed if null

            // DayOfWeek Check (Enum validation)
            RuleFor(x => x.DayOfWeek)
                .NotEmpty().WithMessage("Day of Week is required.")
                .Must(day => Enum.TryParse(typeof(DayOfWeekEnum), day, true, out _))
                .WithMessage($"Invalid Day of Week. Must be one of: {string.Join(", ", Enum.GetNames(typeof(DayOfWeekEnum)))}.");

            // Time Checks
            RuleFor(x => x.StartTime)
                .NotNull().WithMessage("Start Time is required.");

            RuleFor(x => x.EndTime)
                .NotNull().WithMessage("End Time is required.")
                .Must((dto, endTime) => endTime > dto.StartTime)
                .WithMessage("End Time must be after Start Time.");
        }
    }
}