using System;
using System.Text.Json.Serialization;

namespace MiniPM.Models
{
    public class TaskItem
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public DateTime? DueDate { get; set; }

        public bool IsCompleted { get; set; } = false;

        public int ProjectId { get; set; }

        [JsonIgnore] // 🔥 This avoids infinite loops
        public Project Project { get; set; }
    }
}
