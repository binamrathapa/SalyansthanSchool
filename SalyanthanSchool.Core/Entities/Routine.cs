using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalyanthanSchool.Core.Entities
{
    [Table("Routine")]
    public class Routine
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("Id")]
        public int Id { get; set; }

        [Required(ErrorMessage = "Time Slot is required")]
        [Column("Time", TypeName = "time")]
        public TimeSpan TimeSlot { get; set; }

        [Required(ErrorMessage = "Priority is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Priority must be a positive number")]
        public int Priority { get; set; }

    }
}
