using Microsoft.AspNetCore.Mvc;
using SalyanthanSchool.Core.DTOs.Section;
using SalyanthanSchool.Core.Interfaces;

namespace SalyanthanSchool.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SectionController : ControllerBase
    {
        private readonly ISectionService _service;

        public SectionController(ISectionService service)
        {
            _service = service;
        }

        // GET: api/section
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] SectionQueryParameter query)
        {
            if (query.PageNumber < 1 || query.PageSize < 1)
                return BadRequest("PageNumber and PageSize must be greater than or equal to 1");

            var result = await _service.GetAsync(query);
            return Ok(result);
        }

        // GET: api/section/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var section = await _service.GetByIdAsync(id);
            return section == null ? NotFound() : Ok(section);
        }

        // POST: api/section
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SectionRequestDto dto)
        {
            try
            {
                var created = await _service.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (InvalidOperationException ex)
            {
                // Conflict if GradeId is invalid or if Section already exists for the Grade
                return Conflict(ex.Message);
            }
        }

        // PUT: api/section/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] SectionRequestDto dto)
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

        // DELETE: api/section/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }
    }
}