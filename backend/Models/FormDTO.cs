namespace prid_2425_f02.Models;

public class FormDTO
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public int Owner { get; set; }
    public int IsPublic { get; set; }
}