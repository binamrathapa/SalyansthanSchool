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

        public DbSet<SalyanthanSchool.Core.Entities.Teacher> Teachers { get; set; } = default!;
        public DbSet<SalyanthanSchool.Core.Entities.Routine> Routines { get; set; } = default!;

        public DbSet<SalyanthanSchool.Core.Entities.Student> Students { get; set; } = default!;
        public DbSet<SalyanthanSchool.Core.Entities.Grade> Grades { get; set; } = default!;
        public DbSet<SalyanthanSchool.Core.Entities.TeacherP> TeacherP { get; set; } = default!;
        public DbSet<SalyanthanSchool.Core.Entities.NeA> NeA { get; set; } = default!;
        public DbSet<SalyanthanSchool.Core.Entities.Hagu> Hagu { get; set; } = default!;
    }
}
