using SalyanthanSchool.Core.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalyanthanSchool.Core.DTOs.Grade
{
    public class GradeQueryParameter:QueryParameter
    {
        public bool? IsActive {  get; set; }
    }
}
