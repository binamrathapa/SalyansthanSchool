using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalyanthanSchool.Core.Entities
{
    [Table("Section")]
    public class Section
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("section_name")]
        public string SectionName { get; set; } = null!;

        [Column("is_active")]
        public bool? IsActive { get; set; } = true;

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        // Navigation property to Grades
        public virtual ICollection<Grade> Grades { get; set; } = new List<Grade>();
    }
}