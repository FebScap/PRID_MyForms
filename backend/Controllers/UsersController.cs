using AutoMapper;
using AutoMapper.Execution;
using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using prid_2425_f02.Helpers;
using prid_2425_f02.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace prid_2425_f02.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class UsersController(FormContext context, IMapper mapper) : ControllerBase
{
    [Authorized(Role.Admin)]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDTO>>> GetAll() {
        // Récupère une liste de tous les membres et utilise le mapper pour les transformer en leur DTO
        return mapper.Map<List<UserDTO>>(await context.Users.ToListAsync());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<UserDTO>> GetOne(int id) {
        // Récupère en DB le membre dont l'ID est passé en paramètre dans l'url
        User? user = await context.Users.FindAsync(id);
        // Si aucun membre n'a été trouvé, renvoyer une erreur 404 Not Found
        if (user == null)
            return NotFound();
        // Transforme le membre en son DTO et retourne ce dernier
        return mapper.Map<UserDTO>(user);
    }

    [AllowAnonymous]
    [HttpPost]
    public async Task<ActionResult<UserDTO>> PostUser(UserDTO user) {
        // Utilise le mapper pour convertir le DTO qu'on a reçu en une instance de User
        User? newUser = mapper.Map<User>(user);
        // Valide les données
        ValidationResult result = await new UserValidator(context).ValidateOnCreate(newUser);
        if (!result.IsValid)
            return BadRequest(result);
        // Ajoute ce nouveau membre au contexte EF
        context.Users.Add(newUser);
        // Sauve les changements
        await context.SaveChangesAsync();

        // Renvoie une réponse ayant dans son body les données du nouveau user
        return CreatedAtAction(nameof(GetOne), new { id = user.Id }, mapper.Map<UserDTO>(newUser));
    }

    [Authorized(Role.Admin)]
    [HttpPut]
    public async Task<IActionResult> PutUser(UserDTO dto) {
        // Récupère en DB le membre à mettre à jour
        User? user = await context.Users.FindAsync(dto.Id);
        // Si aucun membre n'a été trouvé, renvoyer une erreur 404 Not Found
        if (user == null)
            return NotFound();
        // Ajoute le membre reçu en paramètre au contexte et force son état à "Modified" pour qu'EF fasse un update
        // Mappe les données reçues sur celles du membre en question
        mapper.Map<UserDTO, User>(dto, user);
        // Valide les données
        ValidationResult? result = await new UserValidator(context).ValidateAsync(user);
        if (!result.IsValid)
            return BadRequest(result);
        // Sauve les changements
        await context.SaveChangesAsync();
        // Retourne un statut 204 avec une réponse vide
        return NoContent();
    }

    [Authorized(Role.Admin)]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteUser(int id) {
        // Récupère en BD le membre à supprimer
        User? user = await context.Users.FindAsync(id);
        // Si aucun membre n'a été trouvé, renvoyer une erreur 404 Not Found
        if (user == null)
            return NotFound();
        // Indique au contexte EF qu'il faut supprimer ce membre
        context.Users.Remove(user);
        // Sauve les changements
        await context.SaveChangesAsync();
        // Retourne un statut 204 avec une réponse vide
        return NoContent();
    }

    [AllowAnonymous]
    [HttpPost("authenticate")]
    public async Task<ActionResult<UserDTO>> Authenticate(UserDTO dto) {
        var user = await Authenticate(dto.Email, dto.Password);

        var result = await new UserValidator(context).ValidateForAuthenticate(user);
        if (!result.IsValid)
            return BadRequest(result);

        return Ok(mapper.Map<UserDTO>(user));
    }
    
    private async Task<User?> Authenticate(string email, string password) {
        var user = await context.Users.Where(u => u.Email == email).FirstOrDefaultAsync();

        // return null if member not found
        if (user == null)
            return null;

        var hash = TokenHelper.GetPasswordHash(password);
        if (user.Password == hash) {
            // authentication successful so generate jwt token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("my-super-secret-key my-super-secret-key");
            var tokenDescriptor = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity(new Claim[] {
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role.ToString())
                }),
                IssuedAt = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddMinutes(10),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            user.Token = tokenHandler.WriteToken(token);
        }

        return user;
    }
    
}
