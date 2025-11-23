using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using SalyanthanSchool.Core.DTOs;
using SalyanthanSchool.Core.Interfaces;
using SalyanthanSchool.Core.Services;
using SalyanthanSchool.Core.Validators;
using SalyanthanSchool.WebAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Add DbContext (SQL Server)
// ---------------------------
builder.Services.AddDbContext<SalyanthanSchoolWebAPIContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


// Add Services (Dependency Injection)
// ---------------------------
builder.Services.AddScoped<ITeacherService, TeacherService>();
builder.Services.AddScoped<IStudentService, StudentService>();
builder.Services.AddScoped<IRoutineService, RoutineService>();
// Add more services if needed
// builder.Services.AddScoped<IGradeService, GradeService>();


// Register Validators
builder.Services.AddValidatorsFromAssemblyContaining<TeacherValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<StudentValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<RoutineValidator>();

// ---------------------------
// Add Controllers with JSON options
// ---------------------------
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Pretty print JSON
        options.JsonSerializerOptions.WriteIndented = true;

        // Optional: format DateTime as yyyy-MM-dd
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonDateTimeConverter("yyyy-MM-dd"));
    });

// ---------------------------
// Add FluentValidation Auto Validation
// ---------------------------
builder.Services.AddFluentValidationAutoValidation();

// ---------------------------
// Swagger (API Documentation)
// ---------------------------
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ---------------------------
// Development tools
// ---------------------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Middleware
app.UseHttpsRedirection();
app.UseAuthorization();

// Map Controllers
app.MapControllers();

app.Run();
