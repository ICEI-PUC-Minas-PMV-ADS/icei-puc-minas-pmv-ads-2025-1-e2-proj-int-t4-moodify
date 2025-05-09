namespace moodifyApi.Models
{
    public class Usuario
    {
        public int UsuarioId { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }

        public List<UsuarioHumor> HumoresAtuais { get; set; }
        public List<Playlist> Playlists { get; set; }

        public List<Humor> SelecionarHumor() => HumoresAtuais?.Select(uh => uh.Humor).ToList();


    }
}
