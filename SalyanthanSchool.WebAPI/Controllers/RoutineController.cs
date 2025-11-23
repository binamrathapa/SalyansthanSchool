using Microsoft.AspNetCore.Mvc;
using SalyanthanSchool.Core.DTOs;
using SalyanthanSchool.Core.Interfaces;
using FluentValidation;


namespace SalyanthanSchool.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoutineController : ControllerBase
    {
        private readonly IRoutineService _service;
        private readonly IValidator<RoutineDTO> _validator;


        public RoutineController(IRoutineService service, IValidator<RoutineDTO> validator)
        {
            _service = service;
            _validator = validator;
        }


        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());


        [HttpGet("paged")]
        public async Task<IActionResult> GetPaged([FromQuery] int pageNumber = 1)
        {
            if (pageNumber < 1) return BadRequest("Page number must be at least 1");
            var result = await _service.GetPagedAsync(pageNumber, 30);
            return Ok(result);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _service.GetByIdAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }


        [HttpPost]
        public async Task<IActionResult> Create([FromBody] RoutineDTO dto)
        {
            var validation = await _validator.ValidateAsync(dto);
            if (!validation.IsValid) return BadRequest(validation.Errors);


            var created = await _service.CreateAsync(dto);
            return Ok(created);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] RoutineDTO dto)
        {
            var validation = await _validator.ValidateAsync(dto);
            if (!validation.IsValid) return BadRequest(validation.Errors);


            var updated = await _service.UpdateAsync(id, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}