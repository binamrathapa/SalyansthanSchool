using Microsoft.AspNetCore.Mvc;
using SalyanthanSchool.Core.DTOs.Grade;
using SalyanthanSchool.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace SalyanthanSchool.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class GradeController : ControllerBase
    {
        private readonly IGradeService _service;

        public GradeController(IGradeService service)
        {
            _service = service;
        }

        // GET: api/grade
        // Supports paging, sorting, searching, filtering
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] GradeQueryParameter query)
        {
            if (query.PageNumber < 1)
                return BadRequest("PageNumber must be greater than or equal to 1");

            if (query.PageSize < 1)
                return BadRequest("PageSize must be greater than or equal to 1");

            var result = await _service.GetAsync(query);
            return Ok(result);
        }

        // GET: api/grade/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var grade = await _service.GetByIdAsync(id);
            return grade == null ? NotFound() : Ok(grade);
        }

        // POST: api/grade
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] GradeRequestDto dto)
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        // PUT: api/grade/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] GradeRequestDto dto)
        {
            var updated = await _service.UpdateAsync(id, dto);
            return updated == null ? NotFound() : Ok(updated);
        }

        // DELETE: api/grade/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }
    }
}
