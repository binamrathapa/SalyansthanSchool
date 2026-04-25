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

        // ── Existing DbSets ────────────────────────────────
        public DbSet<Grade> Grade { get; set; } = default!;
        public DbSet<Teacher> Teachers { get; set; } = default!;
        public DbSet<Student> Student { get; set; } = default!;
        public DbSet<Section> Section { get; set; } = default!;
        public DbSet<Subject> Subject { get; set; } = default!;
        public DbSet<ClassRoutine> ClassRoutines { get; set; } = default!;
        public DbSet<SystemUser> SystemUser { get; set; } = default!;
        public DbSet<FeeCategory> FeeCategory { get; set; } = default!;
        public DbSet<FeeHead> FeeHead { get; set; } = default!;
        public DbSet<FeeStructure> FeeStructure { get; set; } = default!;
        public DbSet<StudentDiscount> StudentDiscount { get; set; } = default!;
        public DbSet<PaymentMode> PaymentMode { get; set; } = default!;
        public DbSet<Invoice> Invoice { get; set; } = default!;
        public DbSet<InvoiceItem> InvoiceItem { get; set; } = default!;
        public DbSet<StudentPayment> StudentPayment { get; set; } = default!;
        public DbSet<AcademicYear> AcademicYear { get; set; } = default!;
        public DbSet<MonthMaster> MonthMaster { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // ── Student ────────────────────────────────────
            // HAS DATABASE TRIGGER (IMPORTANT)
            modelBuilder.Entity<Student>()
                .ToTable("Student", tb =>
                {
                    tb.HasTrigger("TR_Student_AdmissionNo");
                });

            // ── Subject ────────────────────────────────────
            // Subject name must be unique
            modelBuilder.Entity<Subject>()
                .HasIndex(s => s.Name)
                .IsUnique();

            // ── ClassRoutine ───────────────────────────────
            // Composite index for class routine
            modelBuilder.Entity<ClassRoutine>()
                .HasIndex(cr => new
                {
                    cr.DayOfWeek,
                    cr.GradeId,
                    cr.SectionId
                });

            // ── Invoice ────────────────────────────────────
            modelBuilder.Entity<Invoice>(entity =>
            {
                // Store InvoiceStatusEnum as INT in DB
                // 0=Unpaid, 1=Paid, 2=Partial, 3=Overdue, 4=Cancelled
                entity.Property(i => i.Status)
                    .HasConversion<int>();

                // Invoice → Student
                entity.HasOne(i => i.Student)
                    .WithMany()
                    .HasForeignKey(i => i.StudentId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Invoice → AcademicYear
                entity.HasOne(i => i.AcademicYear)
                    .WithMany()
                    .HasForeignKey(i => i.AcademicYearId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Invoice → InvoiceItems (one to many)
                entity.HasMany(i => i.InvoiceItems)
                    .WithOne(ii => ii.Invoice)
                    .HasForeignKey(ii => ii.InvoiceId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Invoice → StudentPayments (one to many)
                entity.HasMany(i => i.Payments)
                    .WithOne(sp => sp.Invoice)
                    .HasForeignKey(sp => sp.InvoiceId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ── InvoiceItem ────────────────────────────────
            modelBuilder.Entity<InvoiceItem>(entity =>
            {
                // InvoiceItem → FeeHead
                entity.HasOne(ii => ii.FeeHead)
                    .WithMany()
                    .HasForeignKey(ii => ii.FeeHeadId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ── StudentPayment ─────────────────────────────
            modelBuilder.Entity<StudentPayment>(entity =>
            {
                // StudentPayment → Student
                entity.HasOne(sp => sp.Student)
                    .WithMany()
                    .HasForeignKey(sp => sp.StudentId)
                    .OnDelete(DeleteBehavior.Restrict);

                // StudentPayment → PaymentMode
                entity.HasOne(sp => sp.PaymentMode)
                    .WithMany()
                    .HasForeignKey(sp => sp.PaymentModeId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Store PaymentStatus as INT
                entity.Property(p => p.Status)
                    .HasConversion<int>();
            });

            // ── StudentDiscount ────────────────────────────
            modelBuilder.Entity<StudentDiscount>(entity =>
            {
                // StudentDiscount → Student
                entity.HasOne(sd => sd.Student)
                    .WithMany()
                    .HasForeignKey(sd => sd.StudentId)
                    .OnDelete(DeleteBehavior.Restrict);

                // StudentDiscount → FeeHead
                entity.HasOne(sd => sd.FeeHead)
                    .WithMany()
                    .HasForeignKey(sd => sd.FeeHeadId)
                    .OnDelete(DeleteBehavior.Restrict);

                // StudentDiscount → AcademicYear
                entity.HasOne(sd => sd.AcademicYear)
                    .WithMany()
                    .HasForeignKey(sd => sd.AcademicYearId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ── MonthMaster ────────────────────────────────
            modelBuilder.Entity<MonthMaster>(entity =>
            {
                entity.HasKey(m => m.Id);
                entity.ToTable("Month_Master");

                entity.Property(m => m.Id)
                    .HasColumnName("id");

                entity.Property(m => m.MonthName)
                    .HasColumnName("month_name")
                    .HasMaxLength(20)
                    .IsRequired();

                entity.Property(m => m.MonthNumber)
                    .HasColumnName("month_number")
                    .IsRequired();
            });

            // ── FeeStructure ───────────────────────────────
            modelBuilder.Entity<FeeStructure>(entity =>
            {
                // FeeStructure → AcademicYear
                entity.HasOne(fs => fs.AcademicYear)
                    .WithMany()
                    .HasForeignKey(fs => fs.AcademicYearId)
                    .OnDelete(DeleteBehavior.Restrict);

                // FeeStructure → Grade
                entity.HasOne(fs => fs.Grade)
                    .WithMany()
                    .HasForeignKey(fs => fs.GradeId)
                    .OnDelete(DeleteBehavior.Restrict);

                // FeeStructure → FeeHead
                entity.HasOne(fs => fs.FeeHead)
                    .WithMany()
                    .HasForeignKey(fs => fs.FeeHeadId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ── FeeHead ────────────────────────────────────
            modelBuilder.Entity<FeeHead>(entity =>
            {
                // FeeHead → FeeCategory
                entity.HasOne(fh => fh.FeeCategory)
                    .WithMany()
                    .HasForeignKey(fh => fh.FeeCategoryId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}