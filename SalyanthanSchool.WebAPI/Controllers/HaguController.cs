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
    public class HaguController : ControllerBase
    {
        private readonly SalyanthanSchoolWebAPIContext _context;

        public HaguController(SalyanthanSchoolWebAPIContext context)
        {
            _context = context;
        }

        // GET: api/Hagu
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Hagu>>> GetHagu()
        {
            return await _context.Hagu.ToListAsync();
        }

        // GET: api/Hagu/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Hagu>> GetHagu(int id)
        {
            var hagu = await _context.Hagu.FindAsync(id);

            if (hagu == null)
            {
                return NotFound();
            }

            return hagu;
        }

        // PUT: api/Hagu/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHagu(int id, Hagu hagu)
        {
            if (id != hagu.Id)
            {
                return BadRequest();
            }

            _context.Entry(hagu).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HaguExists(id))
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

        // POST: api/Hagu
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Hagu>> PostHagu(Hagu hagu)
        {
            _context.Hagu.Add(hagu);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetHagu", new { id = hagu.Id }, hagu);
        }

        // DELETE: api/Hagu/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHagu(int id)
        {
            var hagu = await _context.Hagu.FindAsync(id);
            if (hagu == null)
            {
                return NotFound();
            }

            _context.Hagu.Remove(hagu);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool HaguExists(int id)
        {
            return _context.Hagu.Any(e => e.Id == id);
        }
    }
}
