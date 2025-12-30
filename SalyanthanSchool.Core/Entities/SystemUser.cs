using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalyanthanSchool.Core.Entities
{
    [Table("SystemUser")]
    public class SystemUser
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("username")]
        public string Username { get; set; } = null!;

        [Column("password")]
        public string Password { get; set; }=null!;

        [Column("role")]
        public string Role { get; set; } = null!;

        [Column("first_name")]
        public string FirstName { get; set; } =null!;

        [Column("last_name")]
        public string LastName { get; set; }

        [Column("email")]
        public string? Email { get; set; }

        [Column("status")]
        public bool Status { get; set; } = true;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
