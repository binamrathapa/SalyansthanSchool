using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("Student")]
public class Student
{
    [Column("id")]
    public int Id { get; set; }

    //[Required]
    //[Column("admission_no")]
    //public string AdmissionNo { get; set; } = null!;

    [Column("first_name")]
    public string FirstName { get; set; } = null!;

    [Column("middle_name")]
    public string? MiddleName { get; set; }   

    [Column("last_name")]
    public string LastName { get; set; } = null!;

    [Column("gender")]
    public string Gender { get; set; } = null!;

    [Column("blood_group")]
    public string? BloodGroup { get; set; }

    [Column("date_of_birth")]
    public DateTime? DateOfBirth { get; set; }

    [Column("admission_date")]
    public DateTime AdmissionDate { get; set; }   

    [Column("address")]
    public string? Address { get; set; }

    [Column("guardian_name")]
    public string? GuardianName { get; set; }

    [Column("guardian_contact")]
    public string? GuardianContact { get; set; }

    [Column("grade_id")]
    public int GradeId { get; set; }

    [Column("section_id")]
    public int SectionId { get; set; }

    [Column("photo")]
    public string? Photo { get; set; }

    [Column("is_active")]
    public bool IsActive { get; set; } = true;

    [Column("created_at")]
    public DateTime? CreatedAt { get; set; } = DateTime.Now;

    [Column("updated_at")]
    public DateTime? UpdatedAt { get; set; }
}
