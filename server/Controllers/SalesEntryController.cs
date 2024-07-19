using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using AutoMapper;

namespace server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SalesEntryController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public SalesEntryController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: /SalesEntry
        [HttpGet(Name = nameof(GetSalesEntry))]
        public async Task<ActionResult<IEnumerable<SalesEntry>>> GetSalesEntry()
        {
            return await _context.Sales_Entry.ToListAsync();
        }

        // GET: /SalesEntry/{id}
        [HttpGet("{id}", Name = nameof(GetSalesEntryById))]
        public async Task<ActionResult<SalesEntry>> GetSalesEntryById(int id)
        {
            var SalesEntry = await _context.Sales_Entry.FindAsync(id);

            if (SalesEntry == null)
            {
                return NotFound();
            }

            return SalesEntry;
        }

        // PUT: /SalesEntry/{id}
        [HttpPut("{id}", Name = nameof(UpdateSalesEntry))]
        public async Task<IActionResult> UpdateSalesEntry(int id, SalesEntry updatedData)
        {
            try
            {

                var SalesEntryToUpdate = await _context.Sales_Entry.FindAsync(id);
                if (SalesEntryToUpdate == null)
                {
                    return NotFound();
                }
                _mapper.Map(updatedData, SalesEntryToUpdate);

                _context.Update(SalesEntryToUpdate);
                await _context.SaveChangesAsync();

                return Ok(SalesEntryToUpdate);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SalesEntryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw new SystemException("Concurrency occurred");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private bool SalesEntryExists(int id)
        {
            return _context.Sales_Entry.Any(e => e.Id == id);
        }
    }
}
