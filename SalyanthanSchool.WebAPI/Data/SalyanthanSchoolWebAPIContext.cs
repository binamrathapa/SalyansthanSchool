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
        public SalyanthanSchoolWebAPIContext(DbContextOptions<SalyanthanSchoolWebAPIContext> options)
            : base(options)
        {
        }

        public DbSet<SalyanthanSchool.Core.Entities.Grade> Grades { get; set; } = default!;
        public DbSet<SalyanthanSchool.Core.Entities.Teacher> Teachers { get; set; } = default!;
        public DbSet<SalyanthanSchool.Core.Entities.Section> Sections { get; set; } = default!;
        public DbSet<SalyanthanSchool.Core.Entities.Subject> Subjects { get; set; } = default!;
        public DbSet<SalyanthanSchool.Core.Entities.ClassRoutine> ClassRoutines { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Define the foreign key relationship and index for efficiency
            modelBuilder.Entity<Section>()
                .HasOne(s => s.Grade)
                .WithMany() // Assuming Grade doesn't need a navigation property to Sections yet, or use .WithMany(g => g.Sections)
                .HasForeignKey(s => s.GradeId);

            modelBuilder.Entity<Subject>()
                .HasIndex(s => s.Name)
                .IsUnique();

            modelBuilder.Entity<ClassRoutine>()
                .HasIndex(cr => new { cr.DayOfWeek, cr.GradeId, cr.SectionId });

            base.OnModelCreating(modelBuilder);
        }
     }
}
