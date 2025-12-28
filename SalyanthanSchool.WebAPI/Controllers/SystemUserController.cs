using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SalyanthanSchool.Core.DTOs.Auth;
using SalyanthanSchool.Core.Interfaces;

namespace SalyanthanSchool.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")] 
    public class SystemUserController : ControllerBase
    {
        private readonly IUserService _userService;

        public SystemUserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _userService.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var user = await _userService.GetByIdAsync(id);
            return user == null ? NotFound() : Ok(user);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] RegisterRequestDto dto)
        {
            var createdUser = await _userService.CreateAsync(dto);
            return CreatedAtAction(nameof(Get), new { id = createdUser.Id }, createdUser);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] RegisterRequestDto dto)
        {
            var updated = await _userService.UpdateAsync(id, dto);
            return updated == null ? NotFound() : Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _userService.DeleteAsync(id);
            return result ? NoContent() : NotFound();
        }
    }
}