using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SalyanthanSchool.Core.DTOs.Auth;
using SalyanthanSchool.Core.Interfaces;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/users")]
public class SystemUserController : ControllerBase
{
    private readonly IUserService _userService;

    public SystemUserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _userService.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var user = await _userService.GetByIdAsync(id);
        return user == null ? NotFound() : Ok(user);
    }

    [HttpPost]
    public async Task<IActionResult> Create(RegisterRequestDto dto)
    {
        var user = await _userService.CreateAsync(dto);
        return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateUserDto dto)
    {
        var updated = await _userService.UpdateAsync(id, dto);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _userService.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
