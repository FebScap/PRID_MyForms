using System.ComponentModel.DataAnnotations;

namespace prid_2425_f02.Models;

public class OptionList
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; }
    public int? Owner  { get; set; }
}