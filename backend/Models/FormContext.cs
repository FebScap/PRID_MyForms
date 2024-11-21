using Microsoft.EntityFrameworkCore;

namespace prid_2425_f02.Models;
public class FormContext(DbContextOptions<FormContext> options) : DbContext(options)
{
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
        base.OnConfiguring(optionsBuilder);
        optionsBuilder
            //.LogTo(Console.WriteLine, LogLevel.Information)
            .EnableSensitiveDataLogging();
    }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<User>().HasData(
            new User { Id=1, Email = "ben@epfc.eu", Password = "Password1,", Role = Role.User, FirstName = "Benoit", LastName = "Penelle" },
            new User { Id=2, Email = "bruno@epfc.eu", Password = "Password1,", Role = Role.User, FirstName = "Bruno", LastName = "Lacroix" },
            new User { Id=3, Email = "boris@epfc.eu", Password = "Password1,", Role = Role.User, FirstName = "Boris", LastName = "Verhaegen" },
            new User { Id=4, Email = "admin@epfc.eu", Password = "Password1,", Role = Role.Admin, FirstName = "Admin", LastName = "Administrator" },
            new User { Id=5, Email = "guest@epfc.eu", Password = "N/A", Role = Role.Guest, FirstName = "Guest", LastName = "No Name" },
            new User { Id=6, Email = "xavier@epfc.eu", Password = "Password1,", Role = Role.User, FirstName = "Xavier", LastName = "Pigeolet" }
        );

        modelBuilder.Entity<Form>().HasData(
            new Form { Id = 1, Title = "Data sheet", Description = "This form is intended to collect your administrative information.", Owner = 1, IsPublic = 1 },
            new Form { Id = 2, Title = "Form 01", Description = "Test form 1", Owner = 1, IsPublic = 0 },
            new Form { Id = 3, Title = "Form 02", Description = "Test form 2", Owner = 2, IsPublic = 0 },
            new Form { Id = 4, Title = "Form 03", Description = "Test form 3", Owner = 1, IsPublic = 0 },
            new Form { Id = 5, Title = "Form 04", Description = "Test form 4", Owner = 1, IsPublic = 0 },
            new Form { Id = 6, Title = "Form 05", Description = "Test form 5", Owner = 1, IsPublic = 0 },
            new Form { Id = 7, Title = "Form 06", Description = "Test form 6", Owner = 1, IsPublic = 0 },
            new Form { Id = 8, Title = "Form 07", Description = "Test form 7", Owner = 1, IsPublic = 0 },
            new Form { Id = 9, Title = "Form 08", Description = "Test form 8", Owner = 1, IsPublic = 0 },
            new Form { Id = 10, Title = "Form 09", Description = "Test form 9", Owner = 1, IsPublic = 0 },
            new Form { Id = 11, Title = "Form 10", Description = "Test form 10", Owner = 1, IsPublic = 0 },
            new Form { Id = 12, Title = "Form 11", Description = "Test form 11", Owner = 1, IsPublic = 0 },
            new Form { Id = 13, Title = "Form 12", Description = "Test form 12", Owner = 1, IsPublic = 0 },
            new Form { Id = 14, Title = "Abc", Description = "Test form", Owner = 1, IsPublic = 0 },
            new Form { Id = 15, Title = "Aaa", Description = "Short test form", Owner = 1, IsPublic = 1 }
        );
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Form> Forms => Set<Form>();
}