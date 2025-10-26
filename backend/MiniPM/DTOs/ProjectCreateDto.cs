using System.ComponentModel.DataAnnotations;

namespace MiniPM.DTOs
{
    public class ProjectCreateDto
    {
        [Required, MinLength(3), MaxLength(100)]
        public string Title { get; set; } = null!;
        [MaxLength(500)]
        public string? Description { get; set; }
    }
}
