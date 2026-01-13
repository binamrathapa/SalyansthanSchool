using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SalyanthanSchool.Core.Interfaces;
using SalyanthanSchool.Core.Validators.Grade;
using SalyanthanSchool.Infrastructure.Services;
using SalyanthanSchool.WebAPI.Data;
using SalyanthanSchool.WebAPI.Filters;
using SalyanthanSchool.WebAPI.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ------------------------------------
// 1. Database Configuration
// ------------------------------------
builder.Services.AddDbContext<SalyanthanSchoolWebAPIContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

// ------------------------------------
// 2. Authentication (JWT Setup)
// ------------------------------------
var jwtSettings = builder.Configuration.GetSection("JwtSettings");

var secretKey = jwtSettings["Key"]
    ?? throw new Exception("JWT Key missing in appsettings.json");

var issuer = jwtSettings["Issuer"]
    ?? throw new Exception("JWT Issuer missing");

var audience = jwtSettings["Audience"]
    ?? throw new Exception("JWT Audience missing");
var key = Encoding.UTF8.GetBytes(secretKey);

builder.Services.AddAuthentication(options =>
{
    // These defaults tell ASP.NET to look for "Bearer" tokens in headers
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

// ------------------------------------
// 3. Services (Dependency Injection)
// ------------------------------------
builder.Services.AddScoped<IGradeService, GradeService>();
//builder.Services.AddScoped<IRoutineService, RoutineService>();
builder.Services.AddScoped<IStudentService, StudentService>();
builder.Services.AddScoped<ISectionService, SectionService>();
builder.Services.AddScoped<ITeacherService, TeacherService>();
builder.Services.AddScoped<ISubjectService, SubjectService>();
builder.Services.AddScoped<IClassRoutineService, ClassRoutineService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAcademicYearService, AcademicYearService>();
builder.Services.AddScoped<IFeeCategoryService, FeeCategoryService>();
builder.Services.AddScoped<IFeeHeadService, FeeHeadService>();
builder.Services.AddScoped<IFeeStructureService, FeeStructureService>();
builder.Services.AddScoped<IStudentDiscountService, StudentDiscountService>();
builder.Services.AddScoped<IPaymentModeService, PaymentModeService>();
builder.Services.AddScoped<IInvoiceService, InvoiceService>();



builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", b => b.AllowAnyMethod().AllowAnyHeader().AllowAnyOrigin());
});


// ------------------------------------
// 4. FluentValidation
// ------------------------------------
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<GradeRequestDtoValidator>();

// ------------------------------------
// 5. Controllers
// ------------------------------------
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.WriteIndented = true;
    });

// ------------------------------------
// 6. Swagger with JWT Support
// ------------------------------------
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Salyanthan School API",
        Version = "v1",
        Description = "School Management System API with Role-Based Security"
    });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter JWT token as: Bearer {your token}"
    });

    options.OperationFilter<AuthorizeCheckOperationFilter>();
});
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

var app = builder.Build();

// ------------------------------------
// 7. Middleware Pipeline
// ------------------------------------
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Salyanthan School API v1")
    );
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseRouting();
// IMPORTANT: Authentication must come BEFORE Authorization
app.UseAuthentication();
app.UseCors("AllowAll");
app.UseAuthorization();
app.UseStaticFiles();

app.MapControllers();

app.Run();
