// src/components/Complaint.jsx
import React, { useState } from "react";

const Complaint = ({ title, location, details, progress }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white shadow-md rounded-xl p-6 mb-6 transition-transform hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <p className="text-gray-500 text-sm mt-1">{location}</p>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-500 font-medium hover:underline text-sm"
        >
          {showDetails ? "Hide Details" : "Show Details"}
        </button>
      </div>

      {showDetails && (
        <p className="mt-4 text-gray-700 leading-relaxed transition-all">
          {details}
        </p>
      )}

      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-right text-gray-500 text-xs mt-1">
          {progress}% resolved
        </p>
      </div>
    </div>
  );
};

export default Complaint;
