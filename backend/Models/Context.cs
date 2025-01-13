using Microsoft.EntityFrameworkCore;

namespace prid_2425_f02.Models;
public class Context(DbContextOptions<Context> options) : DbContext(options)
{
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
        base.OnConfiguring(optionsBuilder);
        optionsBuilder
            //.LogTo(Console.WriteLine, LogLevel.Information)
            .EnableSensitiveDataLogging();
    }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<Access>()
            .HasKey(a => new { a.FormId, a.UserId });
        
        modelBuilder.Entity<Answer>()
            .HasKey(a => new { a.InstanceId, a.QuestionId, a.Idx });
        
        modelBuilder.Entity<OptionValue>()
            .HasKey(o => new { o.OptionListId, o.Idx });
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Form> Forms => Set<Form>();
    public DbSet<Question> Questions => Set<Question>();
    public DbSet<Answer> Answers => Set<Answer>();
    public DbSet<Access> Accesses => Set<Access>();
    public DbSet<Instance> Instances => Set<Instance>();
    public DbSet<OptionList> OptionsLists => Set<OptionList>();
    public DbSet<OptionValue> OptionValues => Set<OptionValue>();
}