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
        
        CreateMap<Access, AccessDTO>()
            .ForMember(dto => dto.FirstName, opt => opt.MapFrom(src => src.User.FirstName))
            .ForMember(dto => dto.LastName, opt => opt.MapFrom(src => src.User.LastName));
        CreateMap<AccessDTO, Access>();

        CreateMap<OptionList, OptionListDTO>();
        CreateMap<OptionListDTO, OptionList>();

        CreateMap<OptionValue, OptionValueDTO>();
        CreateMap<OptionValueDTO, OptionValue>();
    }
    
    
}
