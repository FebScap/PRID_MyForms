using System.ComponentModel.DataAnnotations;

namespace prid_2425_f02.Models;

public enum Type
{
    Short, Long, Date, Email, Integer, Check, Combo, Radio
}

public class Question
{
    [Key]
    public int Id { get; set; }
    public int FormId { get; set; }
    public Form Form { get; set; }
    public int IdX { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public Type Type { get; set; }
    public bool Required { get; set; }
    public int? OptionList { get; set; }
    public ICollection<Answer> Answers { get; set; } = new HashSet<Answer>();

}