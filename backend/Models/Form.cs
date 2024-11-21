using System.ComponentModel.DataAnnotations;

namespace prid_2425_f02.Models;

public class Form {
    [Key]
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public int Owner { get; set; }
    public int IsPublic { get; set; }
}