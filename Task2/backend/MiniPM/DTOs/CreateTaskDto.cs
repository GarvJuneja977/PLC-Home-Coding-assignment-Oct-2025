using System.ComponentModel.DataAnnotations;

namespace MiniPM.DTOs
{
    public class CreateTaskDto
    {
        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Title { get; set; }

        public DateTime? DueDate { get; set; }
    }
}
