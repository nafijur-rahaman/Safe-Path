import { NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const { logout } = useAuth();

const handleLogout = async () => {
  const res = await logout();
  if (res) {
    navigate("/admin-login");
  }
};


  const base =
    "flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 transition-all duration-300";
  const active =
    "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md shadow-red-500/20";

  return (
    <aside className="w-72 min-h-screen bg-[#0D0F12] text-white border-r border-white/5 flex flex-col py-6">
      
      {/* Logo */}
      <div className="px-6 mb-10">
        <h2 className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
          SafePath Admin
        </h2>
        <p className="text-gray-500 text-sm mt-1">Control Center</p>
      </div>

      {/* Navigation */}
      <nav className="px-4 space-y-4 flex-1">

        <p className="text-xs uppercase tracking-wider text-gray-500 mb-2 px-2">
          Main Menu
        </p>

        {/* Dashboard */}
        <NavLink
          to="/admin-dashboard"
          end
          className={({ isActive }) =>
            isActive ? `${base} ${active}` : `${base} hover:bg-gray-800/40`
          }
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        {/* All Reports */}
        <NavLink
          to="/admin-dashboard/all-reports"
          className={({ isActive }) =>
            isActive ? `${base} ${active}` : `${base} hover:bg-gray-800/40`
          }
        >
          <AlertTriangle size={20} />
          All Reports
        </NavLink>

        {/* All Tips */}
        <NavLink
          to="/admin-dashboard/all-tips"
          className={({ isActive }) =>
            isActive ? `${base} ${active}` : `${base} hover:bg-gray-800/40`
          }
        >
          <Lightbulb size={20} />
          All Tips
        </NavLink>

      </nav>

      {/* Logout */}
      <div className="px-6 mt-6">
        <button onClick={()=>handleLogout()} className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition cursor-pointer">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
