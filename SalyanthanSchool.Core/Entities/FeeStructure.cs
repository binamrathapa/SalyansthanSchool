using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalyanthanSchool.Core.Entities
{
    [Table("Fee_Structure")]
    public class FeeStructure
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("academic_year_id")]
        public int AcademicYearId { get; set; }

        [Column("grade_id")]
        public int GradeId { get; set; }

        [Column("fee_head_id")]
        public int FeeHeadId { get; set; }

        [Column("amount")]
        public decimal Amount { get; set; }

        [Column("is_monthly")]
        public bool IsMonthly { get; set; }

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; } = DateTime.Now;

        [ForeignKey("AcademicYearId")]
        public virtual AcademicYear AcademicYear { get; set; } = null!;

        [ForeignKey("GradeId")]
        public virtual Grade Grade { get; set; } = null!;

        [ForeignKey("FeeHeadId")]
        public virtual FeeHead FeeHead { get; set; } = null!;
    }
}