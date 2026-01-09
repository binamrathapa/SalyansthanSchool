using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalyanthanSchool.Core.Entities
{
    [Table("Fee_Head")]
    public class FeeHead
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("fee_category_id")]
        [Required]
        public int FeeCategoryId { get; set; }

        [Column("name")]
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = null!;

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; } = DateTime.Now;

        [ForeignKey("FeeCategoryId")]
        public virtual FeeCategory FeeCategory { get; set; } = null!;
    }
}