using System.ComponentModel.DataAnnotations;

namespace MiniPM.DTOs
{
    public class TaskCreateDto
    {
        [Required, MinLength(1), MaxLength(100)]
        public string Title { get; set; } = null!;
        public DateTime? DueDate { get; set; }
    }
}
