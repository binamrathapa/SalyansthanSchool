using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization; // Required for enum conversion

namespace SalyanthanSchool.Core.Entities
{
    // Define an Enum for Day of Week for strict typing
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum DayOfWeekEnum
    {
        Monday,
        Tuesday,
        Wednesday,
        Thursday,
        Friday,
        Saturday,
        Sunday
    }

    [Table("class_routine")]
    public class ClassRoutine
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("grade_id")]
        public int GradeId { get; set; }

        [Column("section_id")]
        public int? SectionId { get; set; } // Nullable FK

        [Column("subject_id")]
        public int SubjectId { get; set; }

        [Column("teacher_id")]
        public int TeacherId { get; set; }

        [Column("day_of_week")]
        public string DayOfWeek { get; set; } = null!; // Storing as string

        [Column("start_time")]
        public TimeOnly StartTime { get; set; }

        [Column("end_time")]
        public TimeOnly EndTime { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        // Navigation Properties
        public virtual Grade Grade { get; set; } = null!;
        public virtual Section? Section { get; set; }
        public virtual Subject Subject { get; set; } = null!;
        public virtual Teacher Teacher { get; set; } = null!;
    }
}