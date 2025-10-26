import { useForm } from "react-hook-form";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      const res = await axiosClient.post("api/auth/register", data);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <input
          {...register("username")}
          placeholder="Username"
          className="border w-full p-2 mb-3 rounded"
        />
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="border w-full p-2 mb-3 rounded"
        />
        <button className="bg-green-500 text-white w-full py-2 rounded">
          Register
        </button>
        <p
          className="text-sm text-blue-600 mt-3 cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Login instead
        </p>
      </form>
    </div>
  );
}
