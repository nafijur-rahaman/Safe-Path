import React, { useState } from "react";
import { NavLink } from "react-router"; 
import {
  Menu,
  X,
  Home,
  LayoutDashboard,
  FilePenLine,
  BookOpenText,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: <Home size={18} /> },
  { href: "/complaints", label: "All Complaints", icon: <LayoutDashboard size={18} /> },
  { href: "/report", label: "Report Complaint", icon: <FilePenLine size={18} /> },

];

const NavItem = ({ href, icon, label, onClick }) => (
  <NavLink
    to={href}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
        isActive
          ? "bg-indigo-600 text-white shadow-md"
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      }`
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

export default function ProfessionalNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-md fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="text-2xl font-bold text-indigo-600 tracking-wide">
          MyApp
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-2">
          {navItems.map((item) => (
            <NavItem key={item.href} href={item.href} icon={item.icon} label={item.label} />
          ))}
        </nav>

        {/* Hamburger (Mobile) */}
        <button
          className="md:hidden p-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-16 left-0 w-full bg-white shadow-lg overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col p-4 gap-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavItem
                href={item.href}
                icon={item.icon}
                label={item.label}
                onClick={() => setIsOpen(false)}
              />
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
