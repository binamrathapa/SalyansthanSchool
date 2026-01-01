using Microsoft.EntityFrameworkCore;
using SalyanthanSchool.Core.Entities;

namespace SalyanthanSchool.WebAPI.Data
{
    public class SalyanthanSchoolWebAPIContext : DbContext
    {
        public SalyanthanSchoolWebAPIContext(
            DbContextOptions<SalyanthanSchoolWebAPIContext> options)
            : base(options)
        {
        }

        public DbSet<Grade> Grades { get; set; } = default!;
        public DbSet<Teacher> Teachers { get; set; } = default!;
        public DbSet<Student> Student { get; set; } = default!;
        public DbSet<Section> Sections { get; set; } = default!;
        public DbSet<Subject> Subjects { get; set; } = default!;
        public DbSet<ClassRoutine> ClassRoutines { get; set; } = default!;
        public DbSet<SystemUser> SystemUser { get; set; } = default!;
        public DbSet<FeeCategory> FeeCategory { get; set; } = default!;


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // 🔹 STUDENT → HAS DATABASE TRIGGER (IMPORTANT)
            modelBuilder.Entity<Student>()
                .ToTable("Student", tb =>
                {
                    tb.HasTrigger("TR_Student_AdmissionNo");
                });

            // 🔹 SECTION → GRADE FK
            modelBuilder.Entity<Section>()
                .HasOne(s => s.Grade)
                .WithMany()
                .HasForeignKey(s => s.GradeId)
                .OnDelete(DeleteBehavior.Restrict);

            // 🔹 SUBJECT NAME UNIQUE
            modelBuilder.Entity<Subject>()
                .HasIndex(s => s.Name)
                .IsUnique();

            // 🔹 CLASS ROUTINE COMPOSITE INDEX
            modelBuilder.Entity<ClassRoutine>()
                .HasIndex(cr => new { cr.DayOfWeek, cr.GradeId, cr.SectionId });

            base.OnModelCreating(modelBuilder);
        }
        public DbSet<SalyanthanSchool.Core.Entities.AcademicYear> AcademicYear { get; set; } = default!;
    }
}
