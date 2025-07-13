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
        public DbSet<FollowInstitution> FollowInstitutions { get; set; }
        public DbSet<FollowCourse> FollowCourses { get; set; }
        public DbSet<FollowForm> FollowForms { get; set; }
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

            builder.Entity<Course>()
                .HasOne(c => c.Institution)
                .WithMany(i => i.Courses)
                .HasForeignKey(c => c.InstitutionId)
                .OnDelete(DeleteBehavior.Cascade);
     
            builder.Entity<Form>()
                .HasOne(f => f.Course)
                .WithMany(c => c.Forms)
                .HasForeignKey(f => f.CourseId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Institution>()
                .HasOne(i => i.Admin)
                .WithMany(u => u.InstitutionsAdministered)
                .HasForeignKey(i => i.AdminId)
                .OnDelete(DeleteBehavior.Restrict);
            
            // if entity is deleted, all followers should also be deleted
            builder.Entity<FollowInstitution>()
                .HasOne(f => f.Institution)
                .WithMany(i => i.Followers)
                .HasForeignKey(f => f.InstitutionId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<FollowCourse>()
                .HasOne(f => f.Course)
                .WithMany(c => c.Followers)
                .HasForeignKey(f => f.CourseId)
                .OnDelete(DeleteBehavior.Cascade);
            builder.Entity<FollowForm>()
                .HasOne(f => f.Form)
                .WithMany(f => f.Followers)
                .HasForeignKey(f => f.FormId)
                .OnDelete(DeleteBehavior.Cascade);

            // if user is deleted then delete all its follow records
            builder.Entity<FollowInstitution>()
                .HasOne(f => f.Follower)
                .WithMany(u => u.FollowingInstitutions)
                .HasForeignKey(f => f.FollowerId)
                .OnDelete(DeleteBehavior.Cascade);
            builder.Entity<FollowCourse>()
                .HasOne(f => f.Follower)
                .WithMany(u => u.FollowingCourses)
                .HasForeignKey(f => f.FollowerId)
                .OnDelete(DeleteBehavior.Cascade);
            builder.Entity<FollowForm>()
                .HasOne(f => f.Follower)
                .WithMany(u => u.FollowingForms)
                .HasForeignKey(f => f.FollowerId)
                .OnDelete(DeleteBehavior.Cascade);

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
