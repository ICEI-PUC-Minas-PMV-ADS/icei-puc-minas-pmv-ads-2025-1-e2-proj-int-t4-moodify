using moodifyApi.Models;

namespace moodifyApi.Servicos
{
    public class MusicRecommendationService
    {
        // Recomenda músicas com base em um único humor
        public List<Musica> RecomendarPorHumor(Humor humor, List<Musica> musicasDisponiveis)
        {
            return musicasDisponiveis
                .Where(m => m.Humores != null && m.Humores.Any(h => h.HumorId == humor.HumorId))
                .ToList();
        }

        // Recomenda músicas com base em múltiplos humores (recomendação mista)
        public List<Musica> RecomendarMix(List<Humor> humores, List<Musica> musicasDisponiveis)
        {
            var idsHumor = humores.Select(h => h.HumorId).ToHashSet();

            return musicasDisponiveis
                .Where(m => m.Humores != null && m.Humores.Any(h => idsHumor.Contains(h.HumorId)))
                .Distinct()
                .ToList();
        }
    }
}
