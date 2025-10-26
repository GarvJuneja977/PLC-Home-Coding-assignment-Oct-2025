using System.Collections.Generic;

namespace MiniPM.Models
{
    public class ScheduleRequest
    {
        public List<ScheduleTask> Tasks { get; set; }
    }

    public class ScheduleTask
    {
        public string Title { get; set; }
        public int EstimatedHours { get; set; }
        public string DueDate { get; set; }
        public List<string> Dependencies { get; set; } = new();
    }
}
