// src/pages/Complaints.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Map,
  List,
  BarChart,
  CheckCircle,
  AlertOctagon,
  Eye,
  AlertTriangle,
  X,
  MapPin,
  Clock,
  ClipboardList,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useAuth } from "../context/AuthContext";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Helper: Transform API report to dashboard format
const transformIncident = (incident) => ({
  id: incident.id,
  type: incident.incident_type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  location: incident.location.display_name,
  details: incident.description,
  date: incident.date_time,
  status:
    incident.status === "accepted"
      ? "Accepted"
      : incident.status.charAt(0).toUpperCase() + incident.status.slice(1),
  coords: [incident.location.latitude, incident.location.longitude],
});

export default function Complaints() {
  const [viewMode, setViewMode] = useState("list");
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    acceptedReports: 0,
    solvedReports: 0,
    rejectedReports: 0,
  });
  const [error, setError] = useState(null);

  const { api } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch report statistics
        const statsRes = await api.get("/report/get-report-statistics/");
        console.log(statsRes);
        if (statsRes.data.success) {
          setStats({
            totalReports: statsRes.data.data.total_reports,
            pendingReports: statsRes.data.data.pending_reports,
            acceptedReports: statsRes.data.data.accepted_reports,
            solvedReports: statsRes.data.data.solved_reports,
            rejectedReports: statsRes.data.data.rejected_reports,
          });
        }

        // Fetch accepted reports
        const reportsRes = await api.get("/report/get-all-accepted-reports/");
        console.log(reportsRes);
        const transformed = reportsRes.data.results.map(transformIncident);
        setIncidents(transformed);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.detail || err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [api]);
console.log(incidents);
  const filteredIncidents = useMemo(() => {
    return incidents
      .filter((incident) => {
        const searchMatch =
          incident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          incident.details.toLowerCase().includes(searchTerm.toLowerCase());
        const statusMatch = filterStatus === "All" || incident.status === filterStatus;
        const typeMatch = filterType === "All" || incident.type === filterType;
        return searchMatch && statusMatch && typeMatch;
      })
      .sort((a, b) =>
        sortBy === "latest"
          ? new Date(b.date) - new Date(a.date)
          : new Date(a.date) - new Date(b.date)
      );
  }, [incidents, searchTerm, filterStatus, filterType, sortBy]);

  const handleViewDetails = (incident) => setSelectedIncident(incident);
  const handleCloseModal = () => setSelectedIncident(null);

  if (isLoading) return <IncidentListLoader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="flex-1 bg-gray-50 min-h-screen p-6 md:p-10 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-indigo-600">All Reported Incidents</h1>
          <p className="text-lg text-gray-500 mt-1">
            View all publicly reported incidents and their status.
          </p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0 bg-gray-200 p-1 rounded-lg">
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center px-4 py-2 rounded-md font-medium transition-all ${
              viewMode === "list" ? "bg-white text-indigo-600 shadow" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <List size={18} className="mr-2" /> List View
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`flex items-center px-4 py-2 rounded-md font-medium transition-all ${
              viewMode === "map" ? "bg-white text-indigo-600 shadow" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Map size={18} className="mr-2" /> Map View
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Reports" value={stats.totalReports} icon={<BarChart className="text-indigo-500" />} />
        <StatCard title="Reports Pending" value={stats.pendingReports} icon={<AlertOctagon className="text-yellow-500" />} />
        <StatCard title="Cases Accepted" value={stats.acceptedReports} icon={<CheckCircle className="text-green-500" />} />
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-8 sticky top-4 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <label className="text-sm font-medium text-gray-500">Search</label>
            <Search size={18} className="absolute top-9 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by location or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full mt-1 pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <FilterDropdown label="Status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option>All</option>
            <option>Pending</option>
            <option>Accepted</option>
            <option>Solved</option>
          </FilterDropdown>

          <FilterDropdown label="Incident Type" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option>All</option>
            <option>Physical Assault</option>
            <option>Verbal Harassment</option>
            <option>Unsafe Area</option>
          </FilterDropdown>

          <FilterDropdown label="Sort By" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </FilterDropdown>
        </div>
      </div>

      {/* Content */}
      {viewMode === "list" ? (
        <IncidentList incidents={filteredIncidents} onViewDetails={handleViewDetails} />
      ) : (
        <IncidentMap incidents={filteredIncidents} />
      )}

      {selectedIncident && <IncidentDetailModal incident={selectedIncident} onClose={handleCloseModal} />}
    </div>
  );
}

// ---------------- Subcomponents ----------------

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-4 transition-all hover:scale-[1.02] hover:shadow-xl">
      <div className="bg-gray-100 p-4 rounded-full">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function FilterDropdown({ label, value, onChange, children }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-500">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full mt-1 p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {children}
      </select>
    </div>
  );
}

function IncidentList({ incidents, onViewDetails }) {
  if (!incidents.length)
    return (
      <div className="text-center py-10 bg-white rounded-xl shadow-sm">
        <p className="text-lg text-gray-500">No incidents found.</p>
        <p className="text-sm text-gray-400 mt-2">Try adjusting your search or filters.</p>
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {incidents.map((incident) => (
        <IncidentCard key={incident.id} incident={incident} onViewDetails={onViewDetails} />
      ))}
    </div>
  );
}

function IncidentCard({ incident, onViewDetails }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl overflow-hidden flex flex-col justify-between">
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-800">{incident.type}</h3>
          <StatusBadge status={incident.status} />
        </div>
        <p className="text-sm text-gray-500 mb-4">
          <span className="font-medium text-gray-600">Location:</span> {incident.location}
        </p>
        <p className="text-gray-700 text-sm line-clamp-3">{incident.details}</p>
      </div>
      <div className="bg-gray-50 p-4 border-t border-gray-100">
        <button
          onClick={() => onViewDetails(incident)}
          className="flex items-center justify-center w-full text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <Eye size={16} className="mr-2" />
          View Details
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status, className = "" }) {
  const styles = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Accepted: "bg-blue-100 text-blue-800 border-blue-200",
    Solved: "bg-green-100 text-green-800 border-green-200",
    Rejected: "bg-red-100 text-red-800 border-red-200",
  };
  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full border ${
        styles[status] || "bg-gray-100 text-gray-800"
      } ${className}`}
    >
      {status}
    </span>
  );
}

function IncidentMap({ incidents }) {
  const defaultPosition = [23.8103, 90.4125]; // Dhaka

  // Aggregate incidents per location
  const locationMap = {};
  incidents.forEach((i) => {
    const key = `${i.coords[0].toFixed(5)},${i.coords[1].toFixed(5)}`;
    if (!locationMap[key]) locationMap[key] = [];
    locationMap[key].push(i);
  });

  return (
    <div className="h-[600px] w-full rounded-2xl shadow-xl overflow-hidden">
      <MapContainer center={defaultPosition} zoom={12} scrollWheelZoom className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {Object.values(locationMap).map((reports, idx) => {
          const first = reports[0];
          const intensity = reports.length;
          return (
            <CircleMarker
              key={idx}
              center={first.coords}
              radius={8 + intensity * 2}
              color={intensity > 1 ? "red" : "orange"}
              fillOpacity={0.6}
            >
              <Popup>
                <div className="font-sans">
                  <h3 className="font-bold text-md">Hotspot ({reports.length} reports)</h3>
                  {reports.map((r, i) => (
                    <div key={i} className="mt-2 border-t border-gray-200 pt-1">
                      <p><strong>Type:</strong> {r.type}</p>
                      <p><strong>Date:</strong> {new Date(r.date).toLocaleString()}</p>
                      <p><strong>Description:</strong> {r.details}</p>
                    </div>
                  ))}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}

function IncidentDetailModal({ incident, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={onClose}>
      <div className="w-full max-w-lg h-full bg-white shadow-2xl flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Incident Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <DetailItem icon={<ClipboardList size={18} />} label="Incident Type" value={incident.type} />
            <DetailItem icon={<Clock size={18} />} label="Date & Time" value={new Date(incident.date).toLocaleString()} />
          </div>
          <div className="col-span-2">
            <DetailItem icon={<MapPin size={18} />} label="Location" value={incident.location} />
          </div>
          <div className="h-64 w-full rounded-lg overflow-hidden border">
            <MapContainer center={incident.coords} zoom={15} className="w-full h-full" scrollWheelZoom={false} dragging={false} zoomControl={false}>
              <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={incident.coords} />
            </MapContainer>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Full Description</h4>
            <p className="text-gray-800 bg-gray-50 p-4 rounded-lg border">{incident.details}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Current Status</h4>
            <StatusBadge status={incident.status} className="text-sm" />
          </div>
        </div>
        <div className="p-6 border-t bg-gray-50 text-right">
          <button onClick={onClose} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Close</button>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div>
      <h4 className="flex items-center text-sm font-medium text-gray-500 mb-1">
        <span className="mr-2 text-gray-400">{icon}</span>
        {label}
      </h4>
      <p className="text-md font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function IncidentListLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
      </div>
      <div className="bg-gray-50 p-4 border-t border-gray-100">
        <div className="h-5 bg-gray-200 rounded w-1/3 mx-auto"></div>
      </div>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl shadow-md flex items-center">
      <AlertTriangle size={24} className="mr-4 text-red-500" />
      <div>
        <h3 className="font-bold text-lg">An Error Occurred</h3>
        <p>{message}</p>
      </div>
    </div>
  );
}
