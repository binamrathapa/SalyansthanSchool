using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalyanthanSchool.Core.Entities
{
    [Table("grade")]
    public class Grade
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        public string Name { get; set; } = null!;

        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        [Column("section_id")]
        public int? SectionId { get; set; }

        [ForeignKey("SectionId")]
        public virtual Section? Section { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }
    }
}