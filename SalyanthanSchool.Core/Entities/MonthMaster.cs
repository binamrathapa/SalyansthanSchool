using System.ComponentModel.DataAnnotations.Schema;

namespace SalyanthanSchool.Core.Entities
{
    [Table("Month_Master")]
    public class MonthMaster
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("month_name")]
        public string MonthName { get; set; } = null!;

        [Column("month_number")]
        public int MonthNumber { get; set; }
    }
}