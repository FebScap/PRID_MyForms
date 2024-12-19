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
public class FormsController(Context context, IMapper mapper) : ControllerBase
{
    [Authorized(Role.Admin)]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<FormDTO>>> GetAll() {
        // Récupère une liste de tous les forms et utilise le mapper pour les transformer en leur DTO
        List<FormDTO> forms = mapper.Map<List<FormDTO>>(await context.Forms.ToListAsync());
        return forms;
    }
}