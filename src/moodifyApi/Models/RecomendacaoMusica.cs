namespace moodifyApi.Models
{
    public class RecomendacaoMusica
    {
        public int RecomendacaoId { get; set; }
        public Recomendacao Recomendacao { get; set; }

        public int MusicaId { get; set; }
        public Musica Musica { get; set; }
    }

}
