namespace prid_2425_f02.Models;

public class UserDTO
{
    public int Id { get; set; }
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public Role Role { get; set; }
    public DateTimeOffset? BirthDate { get; set; }
    public string? Token { get; set; }
}