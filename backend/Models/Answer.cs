using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid_2425_f02.Models;

public class Answer
{
    public int Instance { get; set; }
    public int Question { get; set; }
    public int Idx { get; set; }
    public string Value { get; set; } = null!;
}