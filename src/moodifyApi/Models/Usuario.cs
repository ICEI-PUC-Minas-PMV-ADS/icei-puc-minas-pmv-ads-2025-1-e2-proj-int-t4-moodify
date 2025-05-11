namespace moodifyApi.Models
{
    public class Usuario
    {
        public int UsuarioId { get; set; }
        public string Nome { get; private set; }
        public string Email { get; private set; }

        public ICollection<Humor> HumoresAtuais { get; set; }
        public ICollection<Playlist> Playlists { get; set; }

        public Usuario(string nome, string email) 
        {
            Nome = nome;
            Email = email;
        }

        public void AtualizarDados(string nome, string email)
        {
            Nome = nome;
            Email = email;
        }
    }
}
