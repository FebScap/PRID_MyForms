namespace prid_2425_f02.Models;

public enum AccessType
{
    User, Editor
}

public class Access
{
    public int User { get; set; }
    public int Form { get; set; }
    public AccessType AccessType { get; set; }
    
}