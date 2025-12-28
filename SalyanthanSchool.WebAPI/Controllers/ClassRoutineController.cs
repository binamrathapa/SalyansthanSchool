using Microsoft.AspNetCore.Mvc;
using SalyanthanSchool.Core.DTOs.ClassRoutine;
using SalyanthanSchool.Core.Interfaces;

namespace SalyanthanSchool.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClassRoutineController : ControllerBase
    {
        private readonly IClassRoutineService _service;

        public ClassRoutineController(IClassRoutineService service)
        {
            _service = service;
        }

        // GET: api/classroutine
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] ClassRoutineQueryParameter query)
        {
            if (query.PageNumber < 1 || query.PageSize < 1)
                return BadRequest("PageNumber and PageSize must be greater than or equal to 1");

            var result = await _service.GetAsync(query);
            return Ok(result);
        }

        // GET: api/classroutine/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var routine = await _service.GetByIdAsync(id);
            return routine == null ? NotFound() : Ok(routine);
        }

        // POST: api/classroutine
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ClassRoutineRequestDto dto)
        {
            try
            {
                var created = await _service.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (InvalidOperationException ex)
            {
                // Conflict if FK fails or schedule overlaps
                return Conflict(ex.Message);
            }
        }

        // PUT: api/classroutine/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] ClassRoutineRequestDto dto)
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

        // DELETE: api/classroutine/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }
    }
}