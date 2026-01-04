using Microsoft.AspNetCore.Mvc;
using SalyanthanSchool.Core.DTOs.FeeHead;
using SalyanthanSchool.Core.Interfaces;

namespace SalyanthanSchool.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeeHeadController : ControllerBase
    {
        private readonly IFeeHeadService _service;

        public FeeHeadController(IFeeHeadService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] FeeHeadQueryParameter query)
        {
            if (query.PageNumber < 1 || query.PageSize < 1)
                return BadRequest("PageNumber and PageSize must be greater than or equal to 1");

            var result = await _service.GetAsync(query);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var head = await _service.GetByIdAsync(id);
            return head == null ? NotFound() : Ok(head);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] FeeHeadRequestDto dto)
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

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] FeeHeadRequestDto dto)
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

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }
    }
}