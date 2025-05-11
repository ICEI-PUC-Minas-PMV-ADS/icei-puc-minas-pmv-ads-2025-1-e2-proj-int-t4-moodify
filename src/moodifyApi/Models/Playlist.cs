namespace moodifyApi.Models
{
    public class Playlist
    {
        public int PlaylistId { get; set; }
        public string Nome { get; set; }
        public DateTime DataDeCriacao { get; set; }

        public int UsuarioId { get; set; }
        public Usuario Usuario { get; set; }

        public ICollection<Musica> Musicas { get; set; }

        //public List<Musica> FiltrarPorHumor(int humorId)
        //{
        //    return Musicas?
        //        .Where(pm => pm.Musica.MusicaHumores.Any(mh => mh.HumorId == humorId))
        //        .Select(pm => pm.Musica)
        //        .ToList();
        //}
    }

}
