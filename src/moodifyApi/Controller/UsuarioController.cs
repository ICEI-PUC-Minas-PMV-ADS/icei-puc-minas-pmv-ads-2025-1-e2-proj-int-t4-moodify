
using Microsoft.EntityFrameworkCore;
using moodifyApi.DTO;
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
            //Adiciona novo usuário
            rotasUsuarios.MapPost("", async (AddUsuarioRequest request, MoodifyDbContext context) =>
            {
                var novoUsuario = new Usuario(request.Nome, request.Email);
                await context.Usuarios.AddAsync(novoUsuario);
                await context.SaveChangesAsync();

                var usuarioRetorno = new UsuarioDto(novoUsuario.UsuarioId, novoUsuario.Nome, novoUsuario.Email);

                return Results.Ok(usuarioRetorno);
            });
            //retorna todos os usúários
            rotasUsuarios.MapGet("", async (MoodifyDbContext context) =>
            {
                var usuarios = await context.Usuarios
                .Select(us => new UsuarioDto(us.UsuarioId, us.Nome, us.Email))
                .ToListAsync();

                return usuarios;
            });
            //Atualizar nome de usuário
            rotasUsuarios.MapPut("{id}", 
                async (int id, AtualizarDadosDeUsuarioRequest request, MoodifyDbContext context) =>
            {
                var usuario = await context.Usuarios
                .SingleOrDefaultAsync(us => us.UsuarioId == id);

                if (usuario == null)
                    return Results.NotFound();

                usuario.AtualizarDados(request.Nome, request.Email);

                await context.SaveChangesAsync();

                return Results.Ok(new UsuarioDto(usuario.UsuarioId, usuario.Nome, usuario.Email));
            });

            //Deletar
            rotasUsuarios.MapDelete("{id}", 
                async (int id, MoodifyDbContext context) =>
            {
                var usuario = await context.Usuarios.SingleOrDefaultAsync(us => us.UsuarioId == id);
                
                if (usuario == null)
                    return Results.NotFound();

                await context.SaveChangesAsync();

                return Results.Ok();
            });
        }
    }
}
