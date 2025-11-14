import { Link } from "react-router";
import React, { useState } from "react"; 
import { Menu, X } from "lucide-react";

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarWidth = 256; // 16rem = 256px

  return (
    <>
      <button
        className="fixed top-4 right-4 z-50 p-3 bg-blue-400/60
          focus:outline-none cursor-pointer
          hover:bg-blue-400 hover:text-white transition-transform duration-300
          rounded-md bg-clip-padding backdrop-blur-sm"
        style={{ transform: `translateX(${isOpen ? -sidebarWidth : 0}px)` }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-blue-400/60 backdrop-blur-sm shadow-lg
          transform transition-transform duration-300 z-40 
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Menu</h2>
          <ul className="space-y-3">
            <li>
              <Link
                to="/"
                className="text-gray-800 hover:text-blue-600"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/complaints"
                className="text-gray-800 hover:text-blue-600"
                onClick={() => setIsOpen(false)}
              >
                Complaints
              </Link>
            </li>
            <li>
              <Link
                to="/report"
                className="text-gray-800 hover:text-blue-600"
                onClick={() => setIsOpen(false)}
              >
                Report Complaint
              </Link>
            </li>
            <li>
              <Link
                to="/stories"
                className="text-gray-800 hover:text-blue-600"
                onClick={() => setIsOpen(false)}
              >
                Stories
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
