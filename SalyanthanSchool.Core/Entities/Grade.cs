using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalyanthanSchool.Core.Entities
{
    [Table("Grade")]
    public class Grade
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("Id")]
        public int Id{get; set;}

        [Required (ErrorMessage = "Gradename is required")]
        [Column("GradeName")]
        [StringLength(50,MinimumLength = 3, ErrorMessage ="GradeName cannot empty")]
        public string Name{get; set;}

    }
}
