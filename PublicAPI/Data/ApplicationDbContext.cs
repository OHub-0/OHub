using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using PublicAPI.Model;
using PublicAPI.Services.Interfaces;

namespace PublicAPI.Data
{
    public class ApplicationDbContext : IdentityDbContext<UserModel>
    {
        public DbSet<Institution> Institutions { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Form> Forms { get; set; }
        public DbSet<follow> Follows { get; set; }
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
            builder.Entity<UserModel>().HasIndex(u => u.PhoneNumber).IsUnique();

            // avoid cascading effects here 
            builder.Entity<Institution>()
                .HasOne(i => i.Admin)
                .WithMany()
                .HasForeignKey(i => i.AdminId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Form>()
                .HasOne(f => f.Institution)
                .WithMany(i => i.Forms)
                .HasForeignKey(f => f.InstitutionId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Form>()
                .HasOne(f => f.Course)
                .WithMany()
                .HasForeignKey(f => f.CourseId)
                .OnDelete(DeleteBehavior.Restrict);


            builder.Entity<Course>()
                .HasOne(Course => Course.Institution)
                .WithMany(Institution => Institution.Courses)
                .HasForeignKey(Course => Course.InstitutionId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<follow>()
                .HasOne(f => f.Institution)
                .WithMany(i => i.Followers)
                .HasForeignKey(f => f.InstitutionId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<follow>()
                .HasOne(f => f.form)
                .WithMany()
                .HasForeignKey(f => f.FormId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<follow>()
               .HasOne(f => f.course)
               .WithMany()
               .HasForeignKey(f => f.CourseId)
               .OnDelete(DeleteBehavior.Restrict);


        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker.Entries<IAuditable>()
                .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Added)
                {
                    entry.Entity.CreatedDate = DateTime.UtcNow;
                }
                else if (entry.State == EntityState.Modified)
                {
                    entry.Entity.ModifiedDate = DateTime.UtcNow;
                }
            }

            return await base.SaveChangesAsync(cancellationToken);

        }
    }
}
