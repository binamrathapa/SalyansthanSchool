using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalyanthanSchool.Core.Entities
{
    [Table("Student_Discount")]
    public class StudentDiscount
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("student_id")]
        public int StudentId { get; set; }

        [Column("fee_head_id")]
        public int FeeHeadId { get; set; }

        [Column("academic_year_id")]
        public int AcademicYearId { get; set; }

        [Column("discount_amount")]
        public decimal DiscountAmount { get; set; }

        [Column("max_discount_amount")]
        public decimal MaxDiscountAmount { get; set; }

        [Column("valid_from")]
        public DateTime ValidFrom { get; set; }

        [Column("valid_to")]
        public DateTime ValidTo { get; set; }

        [Column("is_active")]
        public bool IsActive { get; set; }

        [ForeignKey("StudentId")]
        public virtual Student Student { get; set; } = null!;

        [ForeignKey("FeeHeadId")]
        public virtual FeeHead FeeHead { get; set; } = null!;

        [ForeignKey("AcademicYearId")]
        public virtual AcademicYear AcademicYear { get; set; } = null!;
    }
}