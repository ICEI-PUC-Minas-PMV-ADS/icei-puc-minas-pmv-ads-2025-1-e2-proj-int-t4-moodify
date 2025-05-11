namespace moodifyApi.Models
{
    public class Musica
    {
        public int MusicaId { get; set; }
        public string Titulo { get; set; }
        public string Artista { get; set; }
        public TimeSpan Duracao { get; set; }

        public ICollection<Humor> Humores { get; set; }
        public ICollection<Playlist> Playlists { get; set; }
    }

}
