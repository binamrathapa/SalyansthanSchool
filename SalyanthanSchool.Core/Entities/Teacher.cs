using System.ComponentModel.DataAnnotations.Schema;

namespace SalyanthanSchool.Core.Entities
{
    [Table("teacher")]
    public class Teacher
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("employee_code")]
        public string EmployeeCode { get; set; } = null!;

        [Column("first_name")]
        public string FirstName { get; set; } = null!;

        [Column("middle_name")]
        public string? MiddleName { get; set; }

        [Column("last_name")]
        public string LastName { get; set; } = null!;

        [Column("gender")]
        public string Gender { get; set; } = null!; // Storing as string based on enum description

        [Column("date_of_birth")]
        public DateOnly DateOfBirth { get; set; }

        [Column("email")]
        public string Email { get; set; } = null!;

        [Column("mobile_no")]
        public string MobileNo { get; set; } = null!;

        [Column("address")]
        public string? Address { get; set; }

        [Column("pan_number")]
        public string PanNumber { get; set; } = null!;

        [Column("qualification")]
        public string Qualification { get; set; } = null!;

        [Column("joining_date")]
        public DateOnly JoiningDate { get; set; }

        [Column("photo")]
        public string? Photo { get; set; }

        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }
    }
}