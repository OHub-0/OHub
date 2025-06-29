using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace User.ManagementAPI.Data
{
    public class ApplicationDbContext : IdentityDbContext<IdentityUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        private static void SeedRoles(ModelBuilder builder)
        {
            builder.Entity<IdentityRole>().HasData(
                           new IdentityRole
                           {
                               Id = "1",
                               Name = "Admin",
                               NormalizedName = "ADMIN"
                           },
                           new IdentityRole
                           {
                               Id = "2",
                               Name = "User",
                               NormalizedName = "USER"
                           },
                           new IdentityRole
                           {
                               Id = "3",
                               Name = "HR",
                               NormalizedName = "HR"
                           }
                       );
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            SeedRoles(builder);
            builder.Entity<IdentityUser>().HasIndex(u=> u.PhoneNumber).IsUnique();
        }
    
    }
}
