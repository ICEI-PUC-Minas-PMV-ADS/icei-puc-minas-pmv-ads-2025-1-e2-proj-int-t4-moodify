namespace moodifyApi.Models
{
    public class Recomendacao
    {
        public int RecomendacaoId { get; set; }

        public int HumorId { get; set; }
        public Humor Humor { get; set; }

        public List<RecomendacaoMusica> RecomendacaoMusicas { get; set; }

        public List<Musica> RecomendarPorHumor()
        {
            return RecomendacaoMusicas?.Select(rm => rm.Musica).ToList();
        }

        public List<Musica> RecomendarMix(List<Humor> outrosHumores)
        {
            return RecomendacaoMusicas?
                .Where(rm => rm.Musica.MusicaHumores
                    .Any(mh => outrosHumores.Select(h => h.HumorId).Contains(mh.HumorId)))
                .Select(rm => rm.Musica)
                .Distinct()
                .ToList();
        }
    }

}
