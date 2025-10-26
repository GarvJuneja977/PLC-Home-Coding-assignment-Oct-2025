using TaskManagerAPI.Models;

namespace TaskManagerAPI.Repositories
{
    public static class TaskRepository
    {
        private static readonly List<TaskItem> tasks = new();
        private static int nextId = 1;

        public static List<TaskItem> GetAll() => tasks;

        public static TaskItem? Get(int id) => tasks.FirstOrDefault(t => t.Id == id);

        public static TaskItem Add(TaskItem task)
        {
            task.Id = nextId++;
            tasks.Add(task);
            return task;
        }

        public static bool Update(int id, TaskItem updatedTask)
        {
            var task = Get(id);
            if (task == null) return false;
            task.Description = updatedTask.Description;
            task.IsCompleted = updatedTask.IsCompleted;
            return true;
        }

        public static bool Delete(int id)
        {
            var task = Get(id);
            if (task == null) return false;
            tasks.Remove(task);
            return true;
        }
    }
}
