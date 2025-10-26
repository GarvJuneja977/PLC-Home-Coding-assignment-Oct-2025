import React, { useEffect, useState } from "react";
import axios from "axios";
import type { Task } from "./types";

const API_URL = "http://localhost:5235/api/tasks"; // <- update if your backend port differs

type Filter = "All" | "Active" | "Completed";

export default function App(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // load from localStorage first, then try to sync with backend
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) {
      try { setTasks(JSON.parse(saved)); } catch {}
    }
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep localStorage in sync
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<Task[]>(API_URL);
      setTasks(res.data);
    } catch (err) {
      setError("Could not fetch tasks from backend. Working with local data.");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    setError(null);
    try {
      const res = await axios.post<Task>(API_URL, {
        description: newTask.trim(),
        isCompleted: false,
      });
      setTasks(prev => [...prev, res.data]);
      setNewTask("");
    } catch (err) {
      setError("Failed to add task to backend. Adding locally.");
      // fallback: add local temporary id (negative) if backend fails
      setTasks(prev => [
        ...prev,
        { id: Date.now() * -1, description: newTask.trim(), isCompleted: false },
      ]);
      setNewTask("");
    }
  };

  const toggleTask = async (task: Task) => {
    setError(null);
    try {
      await axios.put(`${API_URL}/${task.id}`, { ...task, isCompleted: !task.isCompleted });
      setTasks(prev => prev.map(t => (t.id === task.id ? { ...t, isCompleted: !t.isCompleted } : t)));
    } catch {
      setError("Toggle failed on backend. Updating locally.");
      setTasks(prev => prev.map(t => (t.id === task.id ? { ...t, isCompleted: !t.isCompleted } : t)));
    }
  };

  const deleteTask = async (taskId: number) => {
    if (!window.confirm("Delete this task?")) return;
    setError(null);
    try {
      await axios.delete(`${API_URL}/${taskId}`);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch {
      setError("Delete failed on backend. Removing locally.");
      setTasks(prev => prev.filter(t => t.id !== taskId));
    }
  };

  const clearCompleted = async () => {
    if (!window.confirm("Remove all completed tasks?")) return;
    const completed = tasks.filter(t => t.isCompleted);
    // optimistic local removal
    setTasks(prev => prev.filter(t => !t.isCompleted));
    // try to delete each on backend; ignore errors (we show message)
    try {
      await Promise.all(completed.map(t => axios.delete(`${API_URL}/${t.id}`)));
    } catch {
      setError("Some deletes failed on backend. Local view updated.");
    }
  };

  const filtered = tasks.filter(t => {
    if (filter === "Active") return !t.isCompleted;
    if (filter === "Completed") return t.isCompleted;
    return true;
  });

  const activeCount = tasks.filter(t => !t.isCompleted).length;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold text-center mb-4">Task Manager</h1>

        <div className="flex gap-2 mb-4">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addTask(); }}
            className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-300"
            placeholder="Add new task and press Enter"
          />
          <button
            onClick={addTask}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Add
          </button>
        </div>

        <div className="flex justify-between items-center mb-3">
          <div className="flex gap-2">
            {(["All", "Active", "Completed"] as Filter[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded ${filter === f ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="text-sm text-gray-600">
            <span className="font-medium">{activeCount}</span> active
          </div>
        </div>

        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
        {loading ? (
          <div className="py-6 text-center text-gray-500">Loading tasks...</div>
        ) : (
          <ul className="space-y-2">
            {filtered.map(task => (
              <li key={task.id} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => toggleTask(task)}
                    className="h-4 w-4"
                  />
                  <span
                    onClick={() => toggleTask(task)}
                    className={`select-none ${task.isCompleted ? "line-through text-gray-400" : ""} cursor-pointer`}
                  >
                    {task.description}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-sm px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
            {filtered.length === 0 && <li className="text-center text-gray-500 py-4">No tasks to show.</li>}
          </ul>
        )}

        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={clearCompleted}
            className="text-sm px-3 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500"
          >
            Clear Completed
          </button>

          <div className="text-sm text-gray-500">Tasks total: <span className="font-medium">{tasks.length}</span></div>
        </div>
      </div>
    </div>
  );
}
