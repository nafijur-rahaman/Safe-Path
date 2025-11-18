import React from "react";
import { Lock, Mail, LogIn, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    const res = await login(username, password);
    if (res) {
      navigate("/admin-dashboard");
      Swal.fire({
        position: "middle",
        icon: "success",
        title: "Login successful",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: "Invalid username or password",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl p-10 shadow-2xl border border-white/10">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <ShieldCheck size={50} className="text-red-400" />
          <h1 className="text-3xl font-bold text-white mt-4 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Authorized personnel only
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div>
            <label className="text-gray-300 text-sm mb-2 block">UserName</label>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3">
              <Mail className="text-gray-400" size={20} />
              <input
                type="text"
                className="w-full bg-transparent p-3 focus:outline-none text-white placeholder-gray-500"
                placeholder="Enter Your UserName"
                name="username"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-300 text-sm mb-2 block">Password</label>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3">
              <Lock className="text-gray-400" size={20} />
              <input
                type="password"
                className="w-full bg-transparent p-3 focus:outline-none text-white placeholder-gray-500"
                placeholder="••••••••"
                name="password"
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 transition-all text-white font-semibold py-3 rounded-xl shadow-lg"
          >
            <LogIn size={20} /> Login
          </button>
        </form>
      </div>
    </div>
  );
}
