using Microsoft.AspNetCore.Mvc;
using SalyanthanSchool.Core.DTOs.Grade;
using SalyanthanSchool.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace SalyanthanSchool.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize] 
    public class GradeController : ControllerBase
    {
        private readonly IGradeService _service;

        public GradeController(IGradeService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] GradeQueryParameter query)
        {
            var result = await _service.GetAsync(query);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var grade = await _service.GetByIdAsync(id);
            return grade == null ? NotFound() : Ok(grade);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] GradeRequestDto dto)
        {
            var created = await _service.CreateAsync(dto);

            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] GradeRequestDto dto)
        {
            var updated = await _service.UpdateAsync(id, dto);

            return updated == null ? NotFound() : Ok(updated);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }
    }
}