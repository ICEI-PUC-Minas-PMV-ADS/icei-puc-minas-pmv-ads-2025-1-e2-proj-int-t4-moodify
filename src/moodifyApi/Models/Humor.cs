namespace moodifyApi.Models
{
    public class Humor
    {
        public int HumorId { get; set; }
        public string Nome { get; set; }
        public string Icone { get; set; }
        public string Cor { get; set; }

        public ICollection<Musica> Musicas { get; set; }
        public ICollection<Usuario> Usuarios { get; set; }

        public List<Humor> MatchSimilar(List<Humor> todos)
        {
            // Exemplo de lógica de similaridade (mock)
            return todos.Where(h => h.Cor == this.Cor && h.HumorId != this.HumorId).ToList();
        }
    }
}
