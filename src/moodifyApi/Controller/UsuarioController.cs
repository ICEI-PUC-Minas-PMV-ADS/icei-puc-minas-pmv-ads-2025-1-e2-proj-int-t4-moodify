
using Microsoft.EntityFrameworkCore;
using moodifyApi.Models;
using moodifyApi.MoodifyContext;
using moodifyApi.Request;

namespace moodifyApi.Controller
{
    public static class UsuarioController
    {
        public static void AddRotasUsuario(this WebApplication app)
        {
            var rotasUsuarios = app.MapGroup("usuarios");

            rotasUsuarios.MapPost("", async (AddUsuarioRequest request, MoodifyDbContext context) =>
            {
                var novoUsuario = new Usuario(request.Nome, request.Email);
                await context.Usuarios.AddAsync(novoUsuario);
                await context.SaveChangesAsync();
            });

            rotasUsuarios.MapGet("", async (MoodifyDbContext context) =>
            {
                var usuarios = await context.Usuarios.ToListAsync();

                return usuarios;
            });
        }
    }
}
