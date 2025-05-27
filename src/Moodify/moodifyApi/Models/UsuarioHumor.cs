namespace moodifyApi.Models
{
    public class UsuarioHumor
    {
        public int UsuarioId { get; set; }
        public Usuario Usuario { get; set; }

        public int HumorId { get; set; }
        public Humor Humor { get; set; }
    }

}
