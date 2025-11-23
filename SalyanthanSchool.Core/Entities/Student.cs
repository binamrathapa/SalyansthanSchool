using SalyanthanSchool.Core.Validators;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalyanthanSchool.Core.Entities
{
    [Table("Student")]
    public class Student
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("ID")]
        public int Id { get;  set; }

        [Required(ErrorMessage = "First Name is required")]
        [Column("FirstName")]
        [Display(Name = "First Name")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "First Name must be at least 3 characters and at most 50 characters")]
        public string FirstName { get; set; }

     
        [Column("MiddleName")]
        [Display(Name = "Middle Name")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "First Name must be at least 3 characters and at most 50 characters")]
        public string? MiddleName { get; set; }

        [Required(ErrorMessage = "Last Name is required")]
        [Column("LastName")]
        [Display(Name = "Last Name")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Last Name must be at least 3 characters and at most 50 characters")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Parents Name is required")]
        [Column("ParentName")]
        [Display(Name = "Parent Name")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Parent Name must be at least 3 characters and at most 50 characters")]
        public string ParentName { get; set; }

        [Required(ErrorMessage = "Guardian Name is required")]
        [Column("GuardianName")]
        [Display(Name = "Guardian Name")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Parent Name must be at least 3 characters and at most 50 characters")]
        public string GuardianName { get; set; }

        [Required(ErrorMessage = "Mobile number is required")]
        [Column("Mobile")]
        [Display(Name = "Mobile")]
        [MinLength(10, ErrorMessage = "Mobile number must be at least 10 digits")]
        [RegularExpression(@"^\d+$", ErrorMessage = "Mobile number must contain only digits")]
        [DataType(DataType.PhoneNumber)]
        public string Mobile { get; set; }

        [Required(ErrorMessage = "Address is required")]
        [Column("Address")]
        [Display(Name = "Address")]
        [StringLength(200, MinimumLength = 3, ErrorMessage = "Address must be at least 3 characters")]
        public string Address { get; set; }

        [Required(ErrorMessage = "Date of Birth is required")]
        [Column("DateOfBirth")]
        [Display(Name = "Date of Birth")]
        [PastOrToday] // Custom validation to prevent future dates
        [DataType(DataType.Date)]
        public DateTime DateOfBirth { get; set; }

        [Required(ErrorMessage = "Date Of Admission is required")]
        [Column("AdmissionDate")]
        [Display(Name = "Admission Date")]
        [PastOrToday] // Custom validation to prevent future dates
        [DataType(DataType.Date)]
        public DateTime AdmissionDate { get; set; }


        [Required(ErrorMessage = "Blood Group is required")]
        [Column("BloodGroup")]
        [Display(Name = "Blood Group")]
        [RegularExpression("^(A|B|AB|O)[+-]$", ErrorMessage = "Blood Group must be one of: A+, A-, B+, B-, AB+, AB-, O+, O-")]
        public string BloodGroup { get; set; }


        [Required(ErrorMessage = "Gender is required")]
        [Column("Gender")]
        [Display(Name ="Gender")]
        [RegularExpression("Male|Female", ErrorMessage = "Gender must be either Male or Female")]
        public string Gender { get; set; }
       


        [Column("Photo")]
        [Display(Name = "Photo")]
        public string? Photo { get; set; }


        // Update method for multiple properties
        public void UpdateDetails(string name, string birth, string? address = null, string? photo = null)
        {
           /* SetName(name);
            SetBirth(birth);
            SetAddress(address);
            SetPhoto(photo); */
        }
    }
}

