using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Models.Masters;

namespace server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        public DbSet<SalesEntry> Sales_Entry { get; set; }
        public DbSet<Materials> Materials { get; set; }
        public DbSet<Customers> Customers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Materials>()
                .HasKey(m => m.Material);

            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Customers>(entity =>
            {
                entity.HasKey(e => e.Customer_Id);
                entity.Property(e => e.Customer_Id).ValueGeneratedOnAdd();
            });
        }
    }
}
