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
    public class NeAController : ControllerBase
    {
        private readonly SalyanthanSchoolWebAPIContext _context;

        public NeAController(SalyanthanSchoolWebAPIContext context)
        {
            _context = context;
        }

        // GET: api/NeA
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NeA>>> GetNeA()
        {
            return await _context.NeA.ToListAsync();
        }

        // GET: api/NeA/5
        [HttpGet("{id}")]
        public async Task<ActionResult<NeA>> GetNeA(int id)
        {
            var neA = await _context.NeA.FindAsync(id);

            if (neA == null)
            {
                return NotFound();
            }

            return neA;
        }

        // PUT: api/NeA/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNeA(int id, NeA neA)
        {
            if (id != neA.Id)
            {
                return BadRequest();
            }

            _context.Entry(neA).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NeAExists(id))
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

        // POST: api/NeA
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<NeA>> PostNeA(NeA neA)
        {
            _context.NeA.Add(neA);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNeA", new { id = neA.Id }, neA);
        }

        // DELETE: api/NeA/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNeA(int id)
        {
            var neA = await _context.NeA.FindAsync(id);
            if (neA == null)
            {
                return NotFound();
            }

            _context.NeA.Remove(neA);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NeAExists(int id)
        {
            return _context.NeA.Any(e => e.Id == id);
        }
    }
}
