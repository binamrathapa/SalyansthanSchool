using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using SalyanthanSchool.Core.Interfaces;
// Remove or comment out the following line, as 'SalyanthanSchool.Core.Services' does not exist or is not needed
// using SalyanthanSchool.Core.Services;
//using SalyanthanSchool.Core.Services;
using SalyanthanSchool.Core.Validators.Grade;
using SalyanthanSchool.Infrastructure.Services;
using SalyanthanSchool.WebAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// ------------------------------------
// Database
// ------------------------------------
builder.Services.AddDbContext<SalyanthanSchoolWebAPIContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

// ------------------------------------
// Services (Dependency Injection)
// ------------------------------------
builder.Services.AddScoped<IGradeService, GradeService>();
//builder.Services.AddScoped<IRoutineService, RoutineService>();
//builder.Services.AddScoped<IStudentService, StudentService>();
//builder.Services.AddScoped<ITeacherService, TeacherService>();

// ------------------------------------
// FluentValidation
// ------------------------------------
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<GradeRequestDtoValidator>();

// ------------------------------------
// Controllers
// ------------------------------------
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Pretty-print JSON
        options.JsonSerializerOptions.WriteIndented = true;
    });

// ------------------------------------
// Swagger
// ------------------------------------
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ------------------------------------
// Middleware
// ------------------------------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();

// Map Controllers
app.MapControllers();

app.Run();
