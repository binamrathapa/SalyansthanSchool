using System.Linq;
using System.Linq.Dynamic.Core;

namespace SalyanthanSchool.Core.Common
{
    public static class IQueryableExtensions
    {
        public static IQueryable<T> OrderByDynamic<T>(this IQueryable<T> query, string sortBy, string sortDir)
        {
            if (string.IsNullOrEmpty(sortBy))
                return query;

            var direction = sortDir?.ToLower() == "desc" ? "descending" : "ascending";
            return query.OrderBy($"{sortBy} {direction}");
        }
    }
}
