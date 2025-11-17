import React from "react";

const AllReports = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">All Incident Reports</h1>

      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <p className="text-gray-600">
          This page will show all reported incidents. You can add filtering,
          sorting, and exporting later.
        </p>

        <div className="mt-6 border-t border-gray-200 pt-4">
          <p className="text-gray-400 text-sm">
            No reports available yet. Waiting for data…
          </p>
        </div>
      </div>
    </div>
  );
};

export default AllReports;
