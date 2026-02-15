using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SalyanthanSchool.Core.DTOs.AcademicYear;
using SalyanthanSchool.Core.Interfaces;

namespace SalyanthanSchool.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class AcademicYearController : ControllerBase
    {
        private readonly IAcademicYearService _service;

        public AcademicYearController(IAcademicYearService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var res = await _service.GetByIdAsync(id);
            return res == null ? NotFound() : Ok(res);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AcademicYearRequestDto dto)
        {
            var res = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = res.Id }, res);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] AcademicYearRequestDto dto)
        {
            var res = await _service.UpdateAsync(id, dto);
            return res == null ? NotFound() : Ok(res);
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> Patch(int id, [FromBody] AcademicYearPatchDto dto)
        {
            var res = await _service.PatchAsync(id, dto);
            return res == null ? NotFound() : Ok(res);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return await _service.DeleteAsync(id) ? NoContent() : NotFound();
        }
    }
}