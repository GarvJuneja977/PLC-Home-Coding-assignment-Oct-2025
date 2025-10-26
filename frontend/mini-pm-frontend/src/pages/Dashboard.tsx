import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate, Link } from "react-router-dom";

interface Project {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axiosClient.get("/api/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load projects. Please log in again.");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const addProject = async () => {
    if (!title.trim()) return alert("Please enter a project title.");
    try {
      await axiosClient.post("/api/projects", { title, description });
      setTitle("");
      setDescription("");
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Error creating project");
    }
  };

  const deleteProject = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await axiosClient.delete(`/api/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Error deleting project");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-6 py-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">Your Projects</h1>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg shadow-md transition-all duration-200"
        >
          Logout
        </button>
      </div>

      {/* Add Project Section */}
      <div className="flex flex-col sm:flex-row gap-3 mb-10">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Project title"
          className="border border-gray-600 bg-gray-800 text-white rounded-lg p-3 w-full sm:w-72 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="border border-gray-600 bg-gray-800 text-white rounded-lg p-3 w-full sm:w-96 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          onClick={addProject}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg"
        >
          Add Project
        </button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <p className="text-gray-400 text-center mt-10">No projects yet. Start by creating one above.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-2xl shadow-lg p-6 transition-all duration-200 hover:scale-[1.02]"
            >
              <Link
                to={`/projects/${p.id}`}
                className="text-xl font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-150"
              >
                {p.title}
              </Link>
              {p.description && (
                <p className="text-gray-300 text-sm mt-2 line-clamp-3">{p.description}</p>
              )}
              <p className="text-gray-500 text-xs mt-3">
                Created on {new Date(p.createdAt).toLocaleString()}
              </p>
              <button
                onClick={() => deleteProject(p.id)}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
