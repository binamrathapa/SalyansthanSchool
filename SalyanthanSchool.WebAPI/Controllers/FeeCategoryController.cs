using Microsoft.AspNetCore.Mvc;
using SalyanthanSchool.Core.DTOs.FeeCategory;
using SalyanthanSchool.Core.DTOs.FeeCategory.SalyanthanSchool.Core.DTOs.Account.FeeCategory;
using SalyanthanSchool.Core.Interfaces;

namespace SalyanthanSchool.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeeCategoryController : ControllerBase
    {
        private readonly IFeeCategoryService _service;

        public FeeCategoryController(IFeeCategoryService service)
        {
            _service = service;
        }

        // GET: api/feecategory
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] FeeCategoryQueryParameter query)
        {
            if (query.PageNumber < 1 || query.PageSize < 1)
                return BadRequest("PageNumber and PageSize must be greater than or equal to 1");

            var result = await _service.GetAllAsync(query);
            return Ok(result);
        }

        // GET: api/feecategory/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _service.GetByIdAsync(id);
            return category == null ? NotFound() : Ok(category);
        }

        // POST: api/feecategory
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] FeeCategoryRequestDto dto)
        {
            try
            {
                var created = await _service.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (InvalidOperationException ex)
            {
                // Conflict if name already exists or logic violation
                return Conflict(ex.Message);
            }
        }

        // PUT: api/feecategory/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] FeeCategoryRequestDto dto)
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

        // DELETE: api/feecategory/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }
    }
}