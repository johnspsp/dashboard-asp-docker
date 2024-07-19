using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models.Masters;
using AutoMapper;

namespace server.Controllers.MasterControllers
{
    [ApiController]
    [Route("[controller]")]
    public class CustomerDataController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public CustomerDataController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: /Customer
        [HttpGet(Name = nameof(GetCustomer))]
        public async Task<ActionResult<IEnumerable<Customers>>> GetCustomer()
        {
            return await _context.Customers.ToListAsync();
        }

        // GET: /Customer/{id}
        [HttpGet("{id}", Name = nameof(GetCustomerById))]
        public async Task<ActionResult<Customers>> GetCustomerById(int id)
        {
            var Customer = await _context.Customers.FindAsync(id);

            if (Customer == null)
            {
                return NotFound();
            }

            return Customer;
        }

        [HttpPost(Name = nameof(PostCustomer))]
        public async Task<IActionResult> PostCustomer([FromBody] List<Customers> Customers)
        {
            if (Customers == null || Customers.Count == 0)
            {
                return BadRequest("No data received");
            }

            try
            {
                foreach (var Customer in Customers)
                {
                    //for now customer only has add not upsert because of ambiguous id
                    _context.Customers.Add(Customer);
                }

                await _context.SaveChangesAsync();

                return Ok("Data uploaded successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("An error occurred while processing the request: " + ex);
            }
        }


    }
}
