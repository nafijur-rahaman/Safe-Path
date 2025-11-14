import React, { useState } from "react";

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Icon */}
      <button
        className="fixed top-4 right-4 z-50 p-3 bg-gray-800 text-white rounded-md focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Simple hamburger lines */}
        <div className="space-y-1">
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </div>
      </button>

      {/* Sidebar Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Menu</h2>
          <ul className="space-y-3">
            <li>
              <a href="#" className="text-gray-800 hover:text-blue-600">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-800 hover:text-blue-600">
                Profile
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-800 hover:text-blue-600">
                Settings
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-800 hover:text-blue-600">
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
