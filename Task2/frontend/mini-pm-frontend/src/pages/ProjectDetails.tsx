import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import toast from "react-hot-toast";


interface Task {
  id: number;
  title: string;
  isCompleted: boolean;
  dueDate?: string;
}

interface Project {
  id: number;
  title: string;
  description?: string;
  createdAt?: string;
}

export default function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [schedule, setSchedule] = useState<string[]>([]);
const [loading, setLoading] = useState(false);


  // Fetch project and its tasks
  useEffect(() => {
    const fetchProjectAndTasks = async () => {
      try {
        const res = await axiosClient.get(`/api/projects/${projectId}`);
        setProject({
          id: res.data.id,
          title: res.data.title,
          description: res.data.description,
          createdAt: res.data.createdAt,
        });
        setTasks(res.data.tasks || []);
      } catch (err) {
        console.error("Failed to fetch project or tasks", err);
      }
    };
    fetchProjectAndTasks();
  }, [projectId]);

  // Add new task
  const addTask = async () => {
    try {
      await axiosClient.post(`/api/projects/${projectId}/tasks`, {
        title,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      });
      setTitle("");
      setDueDate("");
      const res = await axiosClient.get(`/api/projects/${projectId}`);
      setTasks(res.data.tasks);
    } catch (err) {
      console.error(err);
      toast.error("Error creating task");
    }
  };

  const generateSchedule = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.post(`/api/projects/${projectId}/schedule`, {
        tasks,
      });
      setSchedule(res.data.recommendedOrder);
    } catch (err) {
        toast.error("Error generating schedule");
    } finally {
      setLoading(false);
    }
  };
  

  // Toggle task complete/incomplete
  const toggleTask = async (id: number, completed: boolean) => {
    try {
      await axiosClient.put(`/api/tasks/${id}`, { isCompleted: completed });
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isCompleted: completed } : t))
      );
    } catch (err) {
      console.error(err);
      alert("Error updating task");
    }
  };

  // Delete task
  const deleteTask = async (id: number) => {
    try {
      await axiosClient.delete(`/api/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert("Error deleting task");
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto text-white">
      {/* Back button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
      >
        ← Back
      </button>

      {/* Main Page Title */}
      <h1 className="text-3xl font-bold mb-6 text-center">Project Tasks</h1>

      {/* Project Info */}
      {project && (
        <div className="mb-8 p-4 bg-gray-800 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold mb-1">{project.title}</h2>
          {project.description && (
            <p className="text-gray-300 mb-2">{project.description}</p>
          )}
          {project.createdAt && (
            <p className="text-gray-500 text-sm">
              Created on: {new Date(project.createdAt).toLocaleString()}
            </p>
          )}
        </div>
      )}

      {/* Add Task */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-600 bg-gray-800 p-2 rounded flex-1"
        />
        <input
          type={dueDate ? "date" : "text"}
          id="date"
          placeholder="Select Due Date"
          onFocus={(e) => (e.target.type = "date")}
          onBlur={(e) => {
            if (!e.target.value) e.target.type = "text";
          }}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border border-gray-600 bg-gray-900 text-gray-100 rounded p-2 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
        />
        <button
          onClick={addTask}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <div className="mt-6 text-center">
  <button
    onClick={generateSchedule}
    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
    disabled={loading}
  >
    {loading ? "Generating..." : "Generate Recommended Schedule"}
  </button>

  {schedule.length > 0 && (
    <div className="mt-4 bg-gray-800 p-4 rounded">
      <h3 className="text-xl font-semibold mb-2">Recommended Order:</h3>
      <ol className="list-decimal list-inside text-gray-300">
        {schedule.map((task, i) => (
          <li key={i}>{task}</li>
        ))}
      </ol>
    </div>
  )}
</div>


      {/* Task List */}
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-start bg-gray-800 p-3 rounded-lg shadow-sm"
          >
            <div className="flex gap-3">
              <input
                type="checkbox"
                checked={task.isCompleted}
                onChange={(e) => toggleTask(task.id, e.target.checked)}
                className="mt-1 accent-blue-500"
              />
              <div>
                <p
                  className={`${
                    task.isCompleted
                      ? "line-through text-gray-400"
                      : "text-white"
                  } text-base`}
                >
                  {task.title}
                </p>
                {task.dueDate && (
                  <p className="text-gray-400 text-sm mt-1">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => deleteTask(task.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 text-sm rounded transition-all duration-200"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
