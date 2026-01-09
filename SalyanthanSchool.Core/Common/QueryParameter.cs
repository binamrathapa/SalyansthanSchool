using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalyanthanSchool.Core.Common
{
    public class QueryParameter
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 30;

        public string? Search { get; set; }

        public string SortBy { get; set; } = "id";
        public string SortDir { get; set; } = "asc";
    }
}
