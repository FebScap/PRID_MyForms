using System.ComponentModel.DataAnnotations;

namespace prid_2425_f02.Models;

public class Instance
{
    [Key]
    public int Id { get; set; }
    public int Form { get; set; }
    public int User { get; set; }
    
    public DateTimeOffset Started { get; set; }
    public DateTimeOffset? Completed { get; set; }
    
}