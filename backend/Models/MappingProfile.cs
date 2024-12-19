using AutoMapper;

namespace prid_2425_f02.Models;

public class MappingProfile : Profile
{
    private Context _context;

    public MappingProfile(Context context) {
        _context = context;
        
        CreateMap<User, UserDTO>();
        CreateMap<UserDTO, User>();
        
        CreateMap<Form, FormDTO>();
        CreateMap<FormDTO, Form>();
        
        CreateMap<Question, QuestionDTO>();
        CreateMap<QuestionDTO, Question>();
        
        CreateMap<Answer, AnswerDTO>();
        CreateMap<AnswerDTO, Answer>();
        
        CreateMap<Instance, InstanceDTO>();
        CreateMap<InstanceDTO, Instance>();
        
        CreateMap<Access, AccessDTO>();
        CreateMap<AccessDTO, Access>();
    }
    
    
}
