import React from "react";
import { Lock, Mail, LogIn, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router";

export default function Login() {
const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        navigate('/admin/dashboard');
    }

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
            <label className="text-gray-300 text-sm mb-2 block">Email</label>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3">
              <Mail className="text-gray-400" size={20} />
              <input
                type="email"
                className="w-full bg-transparent p-3 focus:outline-none text-white placeholder-gray-500"
                placeholder="admin@example.com"
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

        {/* OR */}
        <div className="flex items-center my-6">
          <div className="h-px bg-white/20 w-full"></div>
          <span className="text-gray-400 text-sm mx-3">OR</span>
          <div className="h-px bg-white/20 w-full"></div>
        </div>

        {/* Google Sign In */}
        <button
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-100 transition shadow-lg"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-6 h-6"
          />
          Sign in with Google
        </button>

      </div>
    </div>
  );
}
