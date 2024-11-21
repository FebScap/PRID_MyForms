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

    public DbSet<User> Users => Set<User>();
    public DbSet<Form> Forms => Set<Form>();
}