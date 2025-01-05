using prid_2425_f02.Controllers;
using System.ComponentModel.DataAnnotations;

namespace prid_2425_f02.Models;

public class Form {
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public int OwnerId { get; set; }
    public User Owner { get; set; } = null!;
    public bool IsPublic { get; set; }
    
    public ICollection<Access> Accesses { get; set;} = new HashSet<Access>();
    public ICollection<Question> Questions { get; set; } = new HashSet<Question>();
    public ICollection<Instance> Instances { get; set; } = new HashSet<Instance>();
}