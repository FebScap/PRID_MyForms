using System.ComponentModel.DataAnnotations.Schema;

namespace prid_2425_f02.Models;

public enum AccessType
{
    User, Editor
}

public class Access
{
    [ForeignKey(nameof(User))]
    public int User { get; set; }

    [ForeignKey(nameof(Form))]
    public int Form { get; set; }

    public AccessType AccessType { get; set; }
    
}