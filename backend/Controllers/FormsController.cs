using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using prid_2425_f02.Helpers;
using prid_2425_f02.Models;

namespace prid_2425_f02.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class FormsController : ControllerBase {
    private readonly FormContext _context;
    private readonly IMapper _mapper;
    
    public FormsController(FormContext context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
    }
    
    /*
     
     Contrôleur pour les forms
     
     */
}