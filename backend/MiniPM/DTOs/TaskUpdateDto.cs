namespace MiniPM.DTOs
{
    public class TaskUpdateDto
    {
        public string? Title { get; set; }
        public DateTime? DueDate { get; set; }
        public bool? IsCompleted { get; set; }
    }
}
