import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Search, AlertTriangle, Clock, MapPin } from "lucide-react";

const INCIDENT_TYPES = [
  { value: "verbal", label: "Verbal Harassment" },
  { value: "physical_assault", label: "Physical Assault" },
  { value: "stalking", label: "Stalking" },
  { value: "discrimination", label: "Discrimination" },
  { value: "unsafe_area", label: "Unsafe Area" },
  { value: "other", label: "Other" },
];

const STATUS_CHOICES = [
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "solved", label: "Solved" },
  { value: "rejected", label: "Rejected" },
];

const AllReports = () => {
  const { api } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch reports
  const fetchReports = async () => {
    try {
      const res = await api.get("report/get-all-reports/");
      const data = res.data.data.map((r) => ({
        ...r,
        localStatus: r.status, // new local var
      }));
      setReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Update status
  const updateStatus = async (id, newStatus) => {
    const actionMap = {
      accepted: "accept",
      solved: "solve",
      rejected: "reject",
    };

    const action = actionMap[newStatus];
    if (!action) return;

    try {
      await api.post(`admin/report/${id}/${action}/`);

      // Update local status instantly
      setReports((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, localStatus: newStatus } : r
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Apply filters
  const filteredReports = reports.filter((r) => {
    const matchSearch =
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.location?.display_name.toLowerCase().includes(search.toLowerCase());

    const matchType = filterType === "all" || r.incident_type === filterType;
    const matchStatus =
      filterStatus === "all" || r.localStatus === filterStatus;

    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Report Management</h1>
        <p className="text-gray-500 mt-2">
          Review and monitor all user-submitted harassment reports.
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm w-full md:w-1/3">
          <Search size={18} className="text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports..."
            className="w-full outline-none text-gray-700"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 shadow-sm"
          >
            <option value="all">All Types</option>
            {INCIDENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 shadow-sm"
          >
            <option value="all">All Status</option>
            {STATUS_CHOICES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="grid grid-cols-6 bg-gray-100 py-3 px-6 text-sm font-semibold text-gray-600 border-b">
          <p>ID</p>
          <p>Type</p>
          <p>Description</p>
          <p>Location</p>
          <p>Date</p>
          <p>Status</p>
        </div>

        {loading && (
          <div className="p-8 text-center text-gray-600">Loading reports…</div>
        )}

        {!loading && filteredReports.length === 0 && (
          <div className="p-8 text-center text-gray-400">No reports found...</div>
        )}

        {filteredReports.map((r) => {
          const currentStatus = r.localStatus || r.status || "pending";

          return (
            <div
              key={r.id}
              className="grid grid-cols-6 py-4 px-6 border-b hover:bg-gray-50 transition"
            >
              <p className="font-semibold text-gray-700">#{r.id}</p>

              <p className="flex items-center gap-2 text-gray-800 capitalize">
                <AlertTriangle size={16} className="text-red-500" />
                {r.incident_type.replace("_", " ")}
              </p>

              <p className="text-gray-500 truncate max-w-[200px]">
                {r.description}
              </p>

              <p className="flex items-center gap-2 text-gray-700 text-sm">
                <MapPin size={14} className="text-red-500" />
                {r.location?.display_name || "Unknown"}
              </p>

              <p className="flex items-center gap-2 text-gray-600">
                <Clock size={14} />
                {new Date(r.date_time).toLocaleString()}
              </p>

              {/* Status */}
              <div className="flex flex-col gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold w-fit ${
                    currentStatus === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : currentStatus === "accepted"
                      ? "bg-green-100 text-green-700"
                      : currentStatus === "solved"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {currentStatus.toUpperCase()}
                </span>

{currentStatus !== "solved" && (
  <select
    value={currentStatus}
    onChange={(e) => updateStatus(r.id, e.target.value)}
    className="px-2 py-1 text-xs rounded border border-gray-300 bg-white text-gray-700 outline-none focus:border-red-500"
  >
 
    {currentStatus === "pending" && (
      <option value="pending" disabled>
        Select Action
      </option>
    )}
  

    {STATUS_CHOICES.filter((s) => s.value !== "pending").map((s) => (
      <option key={s.value} value={s.value}>
        {s.label}
      </option>
    ))}
  </select>
)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllReports;
