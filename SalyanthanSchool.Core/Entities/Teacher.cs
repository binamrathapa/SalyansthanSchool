using SalyanthanSchool.Core.Validators;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.RegularExpressions;

namespace SalyanthanSchool.Core.Entities
{
    [Table("Teacher")]
    public class Teacher
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("Id")]
        [Display(Name = "TeacherID")]
        public int Id { get; set; }

        [Required(ErrorMessage = "First Name is required")]
        [Column("FirstName")]
        [Display(Name = "FirstName")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "First Name must be at least 3 characters and at most 50 characters")]
        public string FirstName { get; set; }

        [Column("MiddleName")]
        [Display(Name = "MiddleName")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Middle Name must be at least 3 characters if provided")]
        public string? MiddleName { get; set; }

        [Required(ErrorMessage = "Last Name is required")]
        [Column("LastName")]
        [Display(Name = "LastName")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Last Name must be at least 3 characters and at most 50 characters")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Address is required")]
        [Column("Address")]
        [Display(Name = "Address")]
        [StringLength(200, MinimumLength = 3, ErrorMessage = "Address must be at least 3 characters")]
        public string Address { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        [Column("Email")]
        [Display(Name = "EmailAddress")]
        [StringLength(100)]
        public string Email { get; set; }

        [Column("PAN")]
        [Display(Name = "PAN")]
        public string? PAN { get; set; } // Optional

        [Column("NID")]
        [Display(Name = "NID")]
        public string? NID { get; set; } // Optional

        [Required(ErrorMessage = "Mobile number is required")]
        [Column("Mobile")]
        [Display(Name = "Mobile")]
        [MinLength(10, ErrorMessage = "Mobile number must be at least 10 digits")]
        [RegularExpression(@"^\d+$", ErrorMessage = "Mobile number must contain only digits")]
        [DataType(DataType.PhoneNumber)]
        public string Mobile { get; set; }

        [Required(ErrorMessage = "Date of Birth is required")]
        [Column("DateOfBirth")]
        [Display(Name = "DOB")]
        [PastOrToday] // Custom validation to prevent future dates
        [DataType(DataType.Date)]
        public DateTime DateOfBirth { get; set; }

        [Required(ErrorMessage = "Gender is required")]
        [Column("Gender")]
        [Display(Name = "Gender")]
        [RegularExpression("Male|Female", ErrorMessage = "Gender must be either Male or Female")]
        [MinLength(1, ErrorMessage = "Gender must be selected")]
        public string Gender { get; set; }

        [Required(ErrorMessage = "Citizenship is required")]
        [Column("Citizenship")]
        [Display(Name = "Citizenship")]
        public string Citizenship { get; set; }

        [Required(ErrorMessage = "Qualification is required")]
        [Column("Qualification")]
        [Display(Name = "Qualification")]
        public string Qualification { get; set; } // Can be used as textarea in UI

        [Column("Photo")]
        [Display(Name = "Photo")]

        public string? Photo { get; set; } // Optional


        // Optional


        // Update method for multiple properties
        public void UpdateDetails(string firstname, string middlename, string lastname, string email, string? address = null,
                               string? qualification = null, string? photo = null)
        {
           /* SetFirstName(firstname);
            SetMiddleName(middlename);
            SetLastName(lastname);
            SetEmail(email);
            SetAddress(address);
            SetQualification(qualification);
            SetPhoto(photo);*/
        }
    }
}
    