using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalyanthanSchool.Core.Entities;
using SalyanthanSchool.WebAPI.Data;

namespace SalyanthanSchool.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeacherPController : ControllerBase
    {
        private readonly SalyanthanSchoolWebAPIContext _context;

        public TeacherPController(SalyanthanSchoolWebAPIContext context)
        {
            _context = context;
        }

        // GET: api/TeacherP
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TeacherP>>> GetTeacherP()
        {
            return await _context.TeacherP.ToListAsync();
        }

        // GET: api/TeacherP/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TeacherP>> GetTeacherP(int id)
        {
            var teacherP = await _context.TeacherP.FindAsync(id);

            if (teacherP == null)
            {
                return NotFound();
            }

            return teacherP;
        }

        // PUT: api/TeacherP/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTeacherP(int id, TeacherP teacherP)
        {
            if (id != teacherP.Id)
            {
                return BadRequest();
            }

            _context.Entry(teacherP).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TeacherPExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/TeacherP
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TeacherP>> PostTeacherP(TeacherP teacherP)
        {
            _context.TeacherP.Add(teacherP);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTeacherP", new { id = teacherP.Id }, teacherP);
        }

        // DELETE: api/TeacherP/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTeacherP(int id)
        {
            var teacherP = await _context.TeacherP.FindAsync(id);
            if (teacherP == null)
            {
                return NotFound();
            }

            _context.TeacherP.Remove(teacherP);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TeacherPExists(int id)
        {
            return _context.TeacherP.Any(e => e.Id == id);
        }
    }
}
