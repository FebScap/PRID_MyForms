namespace prid_2425_f02.Models
{
    public class OptionListDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int? OwnerId  { get; set; }
        public OptionValueDTO[] Values { get; set; }
    }
}