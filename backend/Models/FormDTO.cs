namespace prid_2425_f02.Models;

public class FormDTO
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public int OwnerId { get; set; }
    public User Owner { get; set; }
    public bool IsPublic { get; set; }
}