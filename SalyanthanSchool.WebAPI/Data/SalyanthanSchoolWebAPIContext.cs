using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SalyanthanSchool.Core.Entities;

namespace SalyanthanSchool.WebAPI.Data
{
    public class SalyanthanSchoolWebAPIContext : DbContext
    {
        public SalyanthanSchoolWebAPIContext (DbContextOptions<SalyanthanSchoolWebAPIContext> options)
            : base(options)
        {
        }

        public DbSet<SalyanthanSchool.Core.Entities.Grade> Grades { get; set; } = default!;
    }
}
