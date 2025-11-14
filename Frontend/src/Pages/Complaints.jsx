// src/Pages/Complaints.jsx
import React, { useState } from "react";
import Complaint from "../components/Complaint";
import { Filter, Search } from "lucide-react";

const dummyComplaints = [
  {
    id: 1,
    title: "Pothole on Main Street",
    location: "Downtown",
    details:
      "There is a large pothole causing traffic issues. Residents have reported multiple accidents.",
    progress: 40,
  },
  {
    id: 2,
    title: "Street light not working",
    location: "Uptown",
    details:
      "The street light near 5th Ave has been out for 3 days. Pedestrians feel unsafe at night.",
    progress: 70,
  },
  {
    id: 3,
    title: "Overflowing trash bin",
    location: "Downtown",
    details:
      "Trash is spilling onto the sidewalk at Market Street. The area smells bad and attracts pests.",
    progress: 20,
  },
  {
    id: 4,
    title: "Broken park bench",
    location: "Uptown",
    details:
      "The bench near Central Park is broken and unsafe for children and elderly visitors.",
    progress: 50,
  },
  {
    id: 5,
    title: "Graffiti on walls",
    location: "Downtown",
    details:
      "Several walls near the subway station are vandalized. Needs cleaning and repainting.",
    progress: 60,
  },
];

export default function Complaints() {
  const [filter, setFilter] = useState("latest");
  const [locationSearch, setLocationSearch] = useState("");

  const filters = [
    { key: "latest", label: "Latest Complaint" },
    { key: "oldest", label: "Oldest Complaint" },
  ];

  // Filter complaints
  const filteredComplaints = [...dummyComplaints]
    .filter((c) =>
      c.location.toLowerCase().includes(locationSearch.toLowerCase())
    )
    .sort((a, b) => {
      if (filter === "latest") return b.id - a.id;
      if (filter === "oldest") return a.id - b.id;
      return 0;
    });

  return (
    <div className="flex h-full min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 p-6 border-r bg-white shadow-lg">
        <h2 className="flex items-center font-bold text-xl mb-6 text-gray-700">
          <Filter className="mr-2" /> Filters
        </h2>

        {/* Sort Filters */}
        <ul className="space-y-3 mb-6">
          {filters.map((f) => (
            <li key={f.key}>
              <button
                className={`w-full text-left p-3 rounded-lg font-medium transition-all duration-200 ${
                  filter === f.key
                    ? "bg-blue-500 text-white shadow-md"
                    : "hover:bg-gray-200 text-gray-700"
                }`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Location Search */}
        <div>
          <label className="block text-gray-600 font-medium mb-2">
            Search by Location
          </label>
          <div className="relative">
            <Search className="absolute top-3 left-3 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Enter location..."
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </div>

      {/* Complaint List */}
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Complaints
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredComplaints.map((c) => (
            <Complaint
              key={c.id}
              title={c.title}
              location={c.location}
              details={c.details}
              progress={c.progress}
            />
          ))}
          {filteredComplaints.length === 0 && (
            <p className="text-gray-500">No complaints found for this location.</p>
          )}
        </div>
      </div>
    </div>
  );
}
