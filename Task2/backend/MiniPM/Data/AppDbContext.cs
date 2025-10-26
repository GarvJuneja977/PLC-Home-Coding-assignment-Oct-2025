using Microsoft.EntityFrameworkCore;    // required for DbContext, DbSet, ModelBuilder
using MiniPM.Models;

namespace MiniPM.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Project> Projects { get; set; } = null!;
        public DbSet<TaskItem> Tasks { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Project>().Property(p => p.Title).HasMaxLength(100).IsRequired();
            modelBuilder.Entity<Project>().Property(p => p.Description).HasMaxLength(500);
            base.OnModelCreating(modelBuilder);
        }
    }
}
