using System.ComponentModel.DataAnnotations.Schema;

namespace SalyanthanSchool.Core.Entities
{
    [Table("section")]
    public class Section
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("grade_id")]
        public int GradeId { get; set; }

        [Column("name")]
        public string Name { get; set; } = null!;

        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        // Navigation Property
        public virtual Grade Grade { get; set; } = null!;
    }
}