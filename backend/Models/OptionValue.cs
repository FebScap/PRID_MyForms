using System.ComponentModel.DataAnnotations.Schema;

namespace prid_2425_f02.Models;

public class OptionValue
{
    [ForeignKey(nameof(OptionList))]
    public int OptionListId { get; set; }
    public OptionList OptionList { get; set; }
    public int Idx { get; set; }
    public string Label { get; set; }
}