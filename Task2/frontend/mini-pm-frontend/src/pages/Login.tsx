import { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
//import { useEffect } from "react";

// useEffect(() => {
//     localStorage.removeItem("token");
//   }, []);

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();   


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await axiosClient.post("/api/auth/login", {
      username,
      password,
    });
    localStorage.setItem("token", response.data.token);
    window.location.href = "/dashboard";
  } catch (err) {
    alert("Login failed");
    console.error(err);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
  <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-md">
  <h1 className="text-3xl font-extrabold mb-8 text-center">Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-700 bg-gray-900 p-2 rounded w-full mb-3"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-700 bg-gray-900 p-2 rounded w-full mb-3"
        />
        <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
        >
        Login
        </button>
      </form>
      <p className="mt-4 text-gray-400">
        Don’t have an account?{" "}
        <a href="/" className="text-blue-400 hover:underline">
          Register
        </a>
      </p>
    </div>
    </div>
  );
}
