using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalyanthanSchool.Core.DTOs.Grade
{
    public class GradeRequestDto
    {
        public string Name { get; set; } = null!;
        public bool IsActive { get; set; } = true;
    }
}
