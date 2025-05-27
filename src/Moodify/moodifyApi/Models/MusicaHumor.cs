namespace moodifyApi.Models
{
    public class MusicaHumor
    {
        public int MusicaId { get; set; }
        public Musica Musica { get; set; }

        public int HumorId { get; set; }
        public Humor Humor { get; set; }
    }

}
