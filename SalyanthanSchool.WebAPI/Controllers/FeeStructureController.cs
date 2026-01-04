using Microsoft.AspNetCore.Mvc;
using SalyanthanSchool.Core.DTOs.FeeStructure;
using SalyanthanSchool.Core.Interfaces;
using SalyanthanSchool.WebAPI.Services;

namespace SalyanthanSchool.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeeStructureController : ControllerBase
    {
        private readonly IFeeStructureService _service;

        public FeeStructureController(IFeeStructureService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] FeeStructureQueryParameter query)
        {
            if (query.PageNumber < 1 || query.PageSize < 1)
                return BadRequest("PageNumber and PageSize must be >= 1");

            return Ok(await _service.GetAsync(query));
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            return result == null ? NotFound() : Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] FeeStructureRequestDto dto)
        {
            try
            {
                var created = await _service.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (InvalidOperationException ex) { return Conflict(ex.Message); }
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] FeeStructureRequestDto dto)
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