using Microsoft.EntityFrameworkCore;
using moodifyApi.Models;

namespace moodifyApi.MoodifyContext
{
    public class MoodifyDbContext : DbContext
    {
        public DbSet<Humor> Humores { get; set; }
        public DbSet<Musica> Musicas { get; set; }
        public DbSet<Playlist> Playlists { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite(connectionString:"Data Source=Banco.sqlite");
            base.OnConfiguring(optionsBuilder);
        }
    }
}
