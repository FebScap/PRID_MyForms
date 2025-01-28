namespace prid_2425_f02.Models;

public class AccessDTO
{
    public int UserId { get; set; }
    public int FormId { get; set; }
    public AccessType AccessType { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
}

public class AccessCreateDTO
{
    public int UserId { get; set; }
    public int FormId { get; set; }
    public AccessType AccessType { get; set; }
}