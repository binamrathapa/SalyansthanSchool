using Microsoft.AspNetCore.Mvc;
using SalyanthanSchool.Core.DTOs.StudentDiscount;
using SalyanthanSchool.Core.Interfaces;

namespace SalyanthanSchool.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentDiscountController : ControllerBase
    {
        private readonly IStudentDiscountService _service;

        public StudentDiscountController(IStudentDiscountService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] StudentDiscountQueryParameter query)
        {
            if (query.PageNumber < 1 || query.PageSize < 1)
                return BadRequest("PageNumber and PageSize must be greater than or equal to 1");

            return Ok(await _service.GetAsync(query));
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            return result == null ? NotFound() : Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] StudentDiscountRequestDto dto)
        {
            try
            {
                var created = await _service.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (InvalidOperationException ex) { return Conflict(ex.Message); }
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }
    }
}