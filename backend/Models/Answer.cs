using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid_2425_f02.Models;

public class Answer
{
    [ForeignKey(nameof(Instance))]
    public int InstanceId { get; set; }
    public Instance Instance { get; set; }
    
    [ForeignKey(nameof(Question))]
    public int QuestionId { get; set; }
    public Question Question { get; set; }
    
    public int Idx { get; set; }
    public string Value { get; set; } = null!;
}