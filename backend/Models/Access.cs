using System.ComponentModel.DataAnnotations.Schema;

namespace prid_2425_f02.Models;

public enum AccessType
{
    User = 0, Editor = 1
}

public class Access
{
    [ForeignKey(nameof(User))]
    public int UserId { get; set; }
    public User User { get; set; }

    
    [ForeignKey(nameof(Form))]
    public int FormId { get; set; }
    public Form Form { get; set; }

    public AccessType AccessType { get; set; }
    
}