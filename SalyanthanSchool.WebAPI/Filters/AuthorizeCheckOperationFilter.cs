using Microsoft.AspNetCore.Authorization;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace SalyanthanSchool.WebAPI.Filters
{
    public class AuthorizeCheckOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            // Check for [Authorize] attribute
            var hasAuthorize =
                context.MethodInfo.DeclaringType?.GetCustomAttributes(true)
                    .OfType<AuthorizeAttribute>().Any() == true
                || context.MethodInfo.GetCustomAttributes(true)
                    .OfType<AuthorizeAttribute>().Any();

            // Check for [AllowAnonymous]
            var hasAllowAnonymous =
                context.MethodInfo.GetCustomAttributes(true)
                    .OfType<AllowAnonymousAttribute>().Any();

            if (!hasAuthorize || hasAllowAnonymous)
                return;

            operation.Security ??= new List<OpenApiSecurityRequirement>();

            operation.Security.Add(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    Array.Empty<string>()
                }
            });
        }
    }
}
