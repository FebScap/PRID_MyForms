namespace prid_2425_f02.Models;

public class InstanceDTO
{
    public int Id { get; set; }
    public int FormId { get; set; }
    public DateTimeOffset Started { get; set; }
    public DateTimeOffset? Completed { get; set; }
}