import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";
import { Clock, MapPin, AlertTriangle } from "lucide-react";

const STATUS_COLORS = {
  pending: "#FBBF24",
  accepted: "#22C55E",
  solved: "#3B82F6",
  rejected: "#EF4444"
};

const Dashboard = () => {
  const { api } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("admin/dashboard/summary/");
        setDashboard(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading dashboard...</div>;
  }

  if (!dashboard) {
    return <div className="p-8 text-center text-red-500">Failed to load data.</div>;
  }

  const statusData = Object.entries(dashboard.status_summary).map(([key, value]) => ({
    name: key,
    value
  }));

  const typeData = Object.entries(dashboard.type_summary).map(([key, value]) => ({
    type: key.replace("_", " "),
    count: value
  }));

  return (
    <div className="p-8 space-y-12">
      {/* Top stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transform transition">
          <p className="text-sm opacity-90">Total Reports</p>
          <h2 className="text-3xl font-bold">{dashboard.total_reports}</h2>
        </div>

        {statusData.map((s) => (
          <div
            key={s.name}
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition duration-300"
          >
            <p className="text-sm text-gray-500">{s.name.charAt(0).toUpperCase() + s.name.slice(1)}</p>
            <h2 className="text-3xl font-bold" style={{ color: STATUS_COLORS[s.name] }}>{s.value}</h2>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Pie Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition duration-300">
          <h3 className="text-lg font-semibold mb-4">Reports by Status</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={40}
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} reports`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Type Bar Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition duration-300">
          <h3 className="text-lg font-semibold mb-4">Reports by Type</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={typeData}>
              <XAxis dataKey="type" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#F43F5E" radius={[8, 8, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Reports Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <div className="grid grid-cols-6 bg-gray-50 py-3 px-6 text-sm font-semibold text-gray-600 border-b sticky top-0 z-10">
          <p>ID</p>
          <p>Type</p>
          <p>Description</p>
          <p>Location</p>
          <p>Date & Time</p>
          <p>Status</p>
        </div>

        {dashboard.recent_reports.map((r) => (
          <div
            key={r.id}
            className="grid grid-cols-6 py-4 px-6 border-b hover:bg-gray-50 transition duration-300 cursor-pointer"
          >
            <p className="font-semibold text-gray-700">#{r.id}</p>
            <p className="flex items-center gap-2 text-gray-800 capitalize">
              <AlertTriangle size={16} className="text-red-400" />
              {r.incident_type.replace("_", " ")}
            </p>
            <p className="text-gray-500 truncate max-w-[250px]">{r.description}</p>
            <p className="flex items-center gap-2 text-gray-700 text-sm">
              <MapPin size={14} className="text-red-400" />
              {r.location?.display_name || "Unknown"}
            </p>
            <p className="flex items-center gap-2 text-gray-600">
              <Clock size={14} />
              {new Date(r.date_time).toLocaleString()}
            </p>
            <p>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold w-fit shadow`}
                style={{ backgroundColor: STATUS_COLORS[r.status], color: "white" }}
              >
                {r.status.toUpperCase()}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
