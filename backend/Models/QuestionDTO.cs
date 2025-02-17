namespace prid_2425_f02.Models;

public class QuestionDTO
{
    public int Id { get; set; }
    public int FormId { get; set; }
    public int IdX { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public Type Type { get; set; }
    public bool Required { get; set; }
    public int? OptionList { get; set; }
}