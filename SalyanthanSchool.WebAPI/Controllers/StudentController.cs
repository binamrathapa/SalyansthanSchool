using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SalyanthanSchool.Core.DTOs.Common;
using SalyanthanSchool.Core.DTOs.Student;
using SalyanthanSchool.Core.Interfaces;

namespace SalyanthanSchool.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class StudentController : ControllerBase
    {
        private readonly IStudentService _studentService;

        public StudentController(IStudentService studentService)
        {
            _studentService = studentService;
        }

        // GET: api/Student
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] StudentQueryParameter parameters)
        {
            var students = await _studentService.GetAllAsync(parameters);

            var total = students.Count(); // total count for pagination

            // Return response in desired API format
            return Ok(ApiResponse<IEnumerable<StudentResponseDto>>.Ok(
                data: students, // directly the array
                message: "Students fetched successfully",
                meta: new
                {
                    parameters.PageNumber,
                    parameters.PageSize,
                    total
                }
            ));
        }


        // GET: api/Student/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var student = await _studentService.GetByIdAsync(id);

            if (student == null)
                return NotFound(ApiResponse<StudentResponseDto>.Fail("Student not found"));

            return Ok(ApiResponse<StudentResponseDto>.Ok(
                student,
                "Student fetched successfully"
            ));
        }

        // POST: api/Student
        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Create([FromForm] StudentRequestDto dto)
        {
            var createdStudent = await _studentService.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = createdStudent.Id },
                ApiResponse<StudentResponseDto>.Ok(
                    createdStudent,
                    "Student created successfully"
                )
            );
        }

        // PUT: api/Student/{id}
        [HttpPut("{id:int}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Update(int id, [FromForm] StudentRequestDto dto)
        {
            var updatedStudent = await _studentService.UpdateAsync(id, dto);

            if (updatedStudent == null)
                return NotFound(ApiResponse<StudentResponseDto>.Fail("Student not found"));

            return Ok(ApiResponse<StudentResponseDto>.Ok(
                updatedStudent,
                "Student updated successfully"
            ));
        }

        // PATCH: api/Student/{id}
        [HttpPatch("{id:int}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Patch(int id, [FromForm] StudentPatchDto dto)
        {
            var patchedStudent = await _studentService.PatchAsync(id, dto);

            if (patchedStudent == null)
                return NotFound(ApiResponse<StudentResponseDto>.Fail("Student not found"));

            return Ok(ApiResponse<StudentResponseDto>.Ok(
                patchedStudent,
                "Student updated successfully"
            ));
        }

        // DELETE: api/Student/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _studentService.DeleteAsync(id);

            if (!deleted)
                return NotFound(ApiResponse<bool>.Fail("Student not found"));

            return Ok(ApiResponse<bool>.Ok(
                true,
                "Student deleted successfully"
            ));
        }

        // POST: api/Student/bulk-delete
        [HttpPost("bulk-delete")]
        public async Task<IActionResult> BulkDelete([FromBody] List<int> ids)
        {
            if (ids == null || !ids.Any())
                return BadRequest(ApiResponse<bool>.Fail("No IDs provided"));

            var deleted = await _studentService.BulkDeleteAsync(ids);

            if (!deleted)
                return NotFound(ApiResponse<bool>.Fail("Students not found"));

            return Ok(ApiResponse<bool>.Ok(
                true,
                "Students deleted successfully"
            ));
        }
    }
}
