using System.ComponentModel.DataAnnotations;

namespace prid_2425_f02.Models;

public class OptionList
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; }
    public int? OwnerId  { get; set; }
    public User? Owner { get; set; }
}