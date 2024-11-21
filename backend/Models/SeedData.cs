using CsvHelper;
using CsvHelper.Configuration;
using prid_2425_f02.Helpers;
using System.Globalization;

namespace prid_2425_f02.Models
{
    public class SeedData(FormContext context)
    {
        public void Seed() {
            context.Users.AddRange(ImportCsvData<User, UserMap>(@"Models\Data\users.csv"));
            context.Forms.AddRange(ImportCsvData<Form, FormMap>(@"Models\Data\forms.csv"));
            context.Questions.AddRange(ImportCsvData<Question, QuestionMap>(@"Models\Data\questions.csv"));
            context.Answers.AddRange(ImportCsvData<Answer, AnswerMap>(@"Models\Data\answers.csv"));
            context.SaveChanges();
        }

        private static List<T> ImportCsvData<T, TM>(string filePath) where TM : ClassMap {
            var config = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                Delimiter = ";",
                HasHeaderRecord = true,
                MissingFieldFound = null,
            };

            using var reader = new StreamReader(filePath);
            using var csv = new CsvReader(reader, config);
            csv.Context.RegisterClassMap<TM>();

            return csv.GetRecords<T>().ToList();
        }
    }

    internal sealed class UserMap : ClassMap<User>
    {
        public UserMap() {
            Map(u => u.Id).Name("id");
            Map(u => u.LastName).Name("last_name");
            Map(u => u.FirstName).Name("first_name");
            Map(u => u.Email).Name("email");
            Map(u => u.Password)
                .Convert(data => TokenHelper.GetPasswordHash(data.Row.GetField("password") ?? ""));
            Map(u => u.BirthDate).Name("birth_date");
            Map(u => u.Role)
                .Convert(data => Enum.Parse<Role>(data.Row.GetField("role") ?? "", true));
        }
    }

    internal sealed class FormMap : ClassMap<Form>
    {
        public FormMap() {
            Map(u => u.Id).Name("id");
            Map(u => u.Title).Name("title");
            Map(u => u.Description).Name("description");
            Map(u => u.Owner).Name("owner");
            Map(u => u.IsPublic).Name("is_public");
        }
    }
    
    internal sealed class QuestionMap : ClassMap<Question>
    {
        public QuestionMap() {
            Map(u => u.Id).Name("id");
            Map(u => u.Form).Name("form");
            Map(u => u.IdX).Name("idx");
            Map(u => u.Title).Name("title");
            Map(u => u.Description).Name("description");
            Map(u => u.Type)
                .Convert(data => Enum.Parse<Type>(data.Row.GetField("type") ?? "", true));
            Map(u => u.Required).Name("required");
            Map(u => u.OptionList).Name("option_list");
        }
    }
    
    internal sealed class AnswerMap : ClassMap<Answer>
    {
        public AnswerMap() {
            Map(u => u.Instance).Name("instance");
            Map(u => u.Question).Name("question");
            Map(u => u.Idx).Name("idx");
            Map(u => u.Value).Name("value");
        }
    }

}
