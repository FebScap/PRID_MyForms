using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid_2425_f02.Models;

public enum Role
{
    Admin = 2, User = 1, Guest = 0
}

public class User {
    [Key]
    public int Id { get; set; }
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public Role Role { get; set; } = Role.User;
    public DateTimeOffset? BirthDate { get; set; }
    public virtual ICollection<Form> Forms { get; set; } = new HashSet<Form>();
    
    [NotMapped]
    public string? Token { get; set; }
    
    public string? RefreshToken { get; set; }

    public int? Age {
        get {
            if (!BirthDate.HasValue)
                return null;
            DateTime today = DateTime.Today;
            int age = today.Year - BirthDate.Value.Year;
            if (BirthDate.Value.Date > today.AddYears(-age)) age--;
            return age;
        }
    }
}