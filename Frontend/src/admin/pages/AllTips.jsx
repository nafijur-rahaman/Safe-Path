import React from "react";

const AllTips = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">All Safety Tips</h1>

      <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
        <p className="text-gray-600">
          This page will show all published safety tips created by admins.
        </p>

        <div className="mt-6 border-t border-gray-200 pt-4">
          <p className="text-gray-400 text-sm">
            No tips added yet. Create some safety advice to get started.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AllTips;
