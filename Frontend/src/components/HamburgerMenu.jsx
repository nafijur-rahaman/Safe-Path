import React, { useState } from "react";
import { NavLink } from "react-router"; 
import {
  Menu,
  X,
  Home,
  LayoutDashboard,
  FilePenLine,
  BookOpenText,
  LogIn,
} from "lucide-react";


const NavItem = ({ href, icon, label, onClick }) => {
  return (
    <li>
      <NavLink
        to={href}
        onClick={onClick}
        className={`flex items-center w-full p-3 rounded-lg font-medium transition-colors text-gray-700 hover:bg-gray-200`}
      >
        {icon}
        <span className="ml-3">{label}</span>
      </NavLink>
    </li>
  );
};

// --- Main Menu Component ---
export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home", icon: <Home size={20} /> },
    {
      href: "/complaints",
      label: "All Complaints",
      icon: <LayoutDashboard size={20} />,
    },
    {
      href: "/report",
      label: "Report Complaint",
      icon: <FilePenLine size={20} />,
    },
    { href: "/stories", label: "Stories", icon: <BookOpenText size={20} /> },
  ];

  return (
    <>
      {/* --- Hamburger Toggle Button --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 right-4 z-50 p-3 rounded-full bg-white/80 text-gray-900 shadow-lg backdrop-blur-sm
          hover:bg-gray-50 transition-all duration-300 ease-in-out
          ${isOpen ? "-translate-x-64" : "translate-x-0"}`}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* --- Sidebar Panel --- */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-slate-50 shadow-2xl
          transform transition-transform duration-300 ease-in-out z-40
          flex flex-col
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-500 hover:text-gray-800"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <NavItem
                key={item.href} // Changed from 'to'
                href={item.href} // Changed from 'to'
                icon={item.icon}
                label={item.label}
                onClick={() => setIsOpen(false)}
              />
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            className="flex items-center justify-center w-full p-3 rounded-lg font-medium
            bg-indigo-600 text-white
            hover:bg-indigo-700 transition-colors"
          >
            <LogIn size={20} />
            <span className="ml-3">Login / Register</span>
          </button>
        </div>
      </div>

      {/* --- Backdrop --- */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}