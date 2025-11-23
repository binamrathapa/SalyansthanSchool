using System;
using System.ComponentModel.DataAnnotations;

namespace SalyanthanSchool.Core.Validators
{
    public class PastOrTodayAttribute : ValidationAttribute
    {
        public PastOrTodayAttribute()
        {
            ErrorMessage = "The date cannot be in the future.";
        }

        public override bool IsValid(object value)
        {
            if (value == null) return true; // [Required] handles null

            if (value is DateTime dateValue)
            {
                return dateValue.Date <= DateTime.Today;
            }

            return false;
        }
    }
}
