namespace moodifyApi.Models
{
    public class Musica
    {
        public int MusicaId { get; set; }
        public string Titulo { get; set; }
        public string Artista { get; set; }
        public TimeSpan Duracao { get; set; }

        public List<PlaylistMusica> PlaylistMusicas { get; set; }
        public List<MusicaHumor> MusicaHumores { get; set; }

        public void AdicionarTagHumor(Humor humor)
        {
            MusicaHumores ??= new List<MusicaHumor>();
            MusicaHumores.Add(new MusicaHumor { Musica = this, Humor = humor });
        }
    }

}
