using System.ComponentModel.DataAnnotations;

namespace prid_2425_f02.Models;

public class Instance
{
    [Key]
    public int Id { get; set; }
    public int FormId { get; set; }
    public Form Form { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
    
    public DateTimeOffset Started { get; set; }
    public DateTimeOffset? Completed { get; set; }
    public ICollection<Answer> Answers { get; set; } = new HashSet<Answer>();
    
    
}