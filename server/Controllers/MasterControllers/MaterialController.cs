using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models.Masters;
using AutoMapper;

namespace server.Controllers.MasterControllers
{
    [ApiController]
    [Route("[controller]")]
    public class MaterialDataController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public MaterialDataController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: /Material
        [HttpGet(Name = nameof(GetMaterial))]
        public async Task<ActionResult<IEnumerable<Materials>>> GetMaterial()
        {
            return await _context.Materials.ToListAsync();
        }

        // GET: /Material/{id}
        [HttpGet("{id}", Name = nameof(GetMaterialById))]
        public async Task<ActionResult<Materials>> GetMaterialById(int id)
        {
            var Material = await _context.Materials.FindAsync(id);

            if (Material == null)
            {
                return NotFound();
            }

            return Material;
        }

        [HttpPost(Name = nameof(PostMaterial))]
        public async Task<IActionResult> PostMaterial([FromBody] List<Materials> materials)
        {
            if (materials == null || materials.Count == 0)
            {
                return BadRequest("No data received");
            }

            try
            {
                foreach (var material in materials)
                {
                    var existingEntity = await _context.Materials.FindAsync(material.Material);
                    if (existingEntity != null)
                    {
                        _context.Entry(existingEntity).CurrentValues.SetValues(material);
                    }
                    else
                    {
                        _context.Materials.Add(material);
                    }
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
