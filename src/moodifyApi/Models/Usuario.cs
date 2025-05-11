namespace moodifyApi.Models
{
    public class Usuario
    {
        public int UsuarioId { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }

        public ICollection<Humor> HumoresAtuais { get; set; }
        public ICollection<Playlist> Playlists { get; set; }

        public Usuario(string nome, string email) 
        {
            Nome = nome;
            Email = email;
        }
    }
}
