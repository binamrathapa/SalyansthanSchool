using Microsoft.AspNetCore.Mvc;
using SalyanthanSchool.Core.DTOs;
using SalyanthanSchool.Core.Interfaces;
using FluentValidation;

namespace SalyanthanSchool.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeacherController : ControllerBase
    {
        private readonly ITeacherService _teacherService;
        private readonly IValidator<TeacherDTO> _validator;

        public TeacherController(ITeacherService teacherService, IValidator<TeacherDTO> validator)
        {
            _teacherService = teacherService;
            _validator = validator;
        }

        // GET all
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var teachers = await _teacherService.GetAllAsync();
            return Ok(teachers);
        }

        // GET paged
        [HttpGet("paged")]
        public async Task<IActionResult> GetPaged([FromQuery] int pageNumber = 1)
        {
            if (pageNumber < 1) return BadRequest("Page number must be at least 1");
            var result = await _teacherService.GetPagedAsync(pageNumber, 30);
            return Ok(result);
        }

        // GET by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var teacher = await _teacherService.GetByIdAsync(id);
            if (teacher == null) return NotFound();
            return Ok(teacher);
        }

        // POST
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TeacherDTO dto)
        {
            var validationResult = await _validator.ValidateAsync(dto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            var created = await _teacherService.CreateAsync(dto);
            return Ok(created);
        }

        // PUT
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] TeacherDTO dto)
        {
            var validationResult = await _validator.ValidateAsync(dto);
            if (!validationResult.IsValid) return BadRequest(validationResult.Errors);

            var updated = await _teacherService.UpdateAsync(id, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        // DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _teacherService.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
