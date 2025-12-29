using Microsoft.AspNetCore.Mvc;
using SalyanthanSchool.Core.DTOs.Teacher;
using SalyanthanSchool.Core.Interfaces;

namespace SalyanthanSchool.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeacherController : ControllerBase
    {
        private readonly ITeacherService _service;

        public TeacherController(ITeacherService service)
        {
            _service = service;
        }

        // GET: api/teacher
        // Supports paging, sorting, searching, filtering
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] TeacherQueryParameter query)
        {
            if (query.PageNumber < 1)
                return BadRequest("PageNumber must be greater than or equal to 1");

            if (query.PageSize < 1)
                return BadRequest("PageSize must be greater than or equal to 1");

            var result = await _service.GetAsync(query);
            return Ok(result);
        }

        // GET: api/teacher/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var teacher = await _service.GetByIdAsync(id);
            return teacher == null ? NotFound() : Ok(teacher);
        }

        // POST: api/teacher
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TeacherRequestDto dto)
        {
            try
            {
                var created = await _service.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
        }

        // PUT: api/teacher/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] TeacherRequestDto dto)
        {
            try
            {
                var updated = await _service.UpdateAsync(id, dto);
                return updated == null ? NotFound() : Ok(updated);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
        }

        // DELETE: api/teacher/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }
    }
}