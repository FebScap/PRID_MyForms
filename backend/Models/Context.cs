﻿using Microsoft.EntityFrameworkCore;

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

        modelBuilder.Entity<User>()
            .HasMany(u => u.Forms)
            .WithMany(u => u.Users)
            .UsingEntity<Access>(
                right => right.HasOne(a => a.Form).WithMany().HasForeignKey(nameof(Access.User))
                    .OnDelete(DeleteBehavior.ClientCascade),
                left => left.HasOne(a => a.User).WithMany().HasForeignKey(nameof(Access.Form))
                    .OnDelete(DeleteBehavior.ClientCascade),
                joinEntity =>{joinEntity.HasKey(a => new { a.User, a.Form });
                }
            );

        modelBuilder.Entity<Answer>()
            .HasKey(a => new { a.Instance, a.Question, a.Idx });
        
        modelBuilder.Entity<OptionValue>()
            .HasKey(o => new { o.OptionList, o.Idx });
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