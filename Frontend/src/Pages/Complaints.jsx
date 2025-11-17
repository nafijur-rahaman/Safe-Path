import React, { useState, useEffect, useMemo } from "react";
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
  Shield,
  ClipboardList,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const dummyIncidents = [
  {
    id: 1,
    type: "Verbal Harassment",
    location: "Dhaka University Campus",
    details:
      "A group of men were catcalling and making inappropriate comments near the arts building.",
    date: "2025-11-14T14:30:00Z",
    status: "Pending",
    coords: [23.734, 90.3925],
    reportedBy: "Anonymous (Student)",
    assignedOfficer: "Officer M. Ahmed",
  },
  {
    id: 2,
    type: "Unsafe Area",
    location: "Gulshan Lake Park (Night)",
    details:
      "The main walking path is completely dark, street lights are broken. I felt very unsafe.",
    date: "2025-11-13T21:15:00Z",
    status: "In Progress",
    coords: [23.7935, 90.4183],
    reportedBy: "Anonymous (Resident)",
    assignedOfficer: "Officer F. Khan",
  },
  {
    id: 3,
    type: "Stalking",
    location: "Banani Road 11",
    details:
      "A man followed me from the bus stop to my apartment entrance for three blocks.",
    date: "2025-11-13T18:00:00Z",
    status: "Resolved",
    coords: [23.794, 90.4068],
    reportedBy: "Anonymous",
    assignedOfficer: "Officer J. Islam",
  },
  {
    id: 4,
    type: "Physical Assault",
    location: "New Market Area",
    details: "Was shoved and threatened by a shopkeeper after a dispute.",
    date: "2025-11-12T13:00:00Z",
    status: "Pending",
    coords: [23.7311, 90.3855],
    reportedBy: "Anonymous",
    assignedOfficer: "Officer M. Ahmed",
  },
  {
    id: 5,
    type: "Discrimination",
    location: "Dhanmondi Restaurant",
    details: "Refused service by the manager based on my appearance.",
    date: "2025-11-11T20:00:00Z",
    status: "In Progress",
    coords: [23.748, 90.3731],
    reportedBy: "Anonymous",
    assignedOfficer: "Officer F. Khan",
  },
  {
    id: 6,
    type: "Verbal Harassment",
    location: "Mohakhali Bus Terminal",
    details: "Bus conductor made lewd remarks and refused to give back change.",
    date: "2025-11-10T09:15:00Z",
    status: "Resolved",
    coords: [23.7801, 90.4072],
    reportedBy: "Anonymous",
    assignedOfficer: "Officer J. Islam",
  },
];

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function IncidentDashboard() {
  const [viewMode, setViewMode] = useState("list");
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [sortBy, setSortBy] = useState("latest");

  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await new Promise((res) => setTimeout(res, 1500));
        setIncidents(dummyIncidents);
      } catch {
        setError("Failed to load incidents. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchIncidents();
  }, []);

  const filteredIncidents = useMemo(() => {
    return incidents
      .filter((incident) => {
        const searchMatch =
          incident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          incident.details.toLowerCase().includes(searchTerm.toLowerCase());
        const statusMatch =
          filterStatus === "All" || incident.status === filterStatus;
        const typeMatch = filterType === "All" || incident.type === filterType;
        return searchMatch && statusMatch && typeMatch;
      })
      .sort((a, b) =>
        sortBy === "latest"
          ? new Date(b.date) - new Date(a.date)
          : new Date(a.date) - new Date(b.date)
      );
  }, [incidents, searchTerm, filterStatus, filterType, sortBy]);

  const dashboardStats = useMemo(() => {
    const totalReports = incidents.length;
    const pendingReports = incidents.filter((i) => i.status === "Pending").length;
    const resolvedReports = incidents.filter((i) => i.status === "Resolved").length;
    return { totalReports, pendingReports, resolvedReports };
  }, [incidents]);

  const handleViewDetails = (incident) => setSelectedIncident(incident);
  const handleCloseModal = () => setSelectedIncident(null);

  const renderContent = () => {
    if (isLoading) return <IncidentListLoader />;
    if (error) return <ErrorMessage message={error} />;
    if (viewMode === "list")
      return <IncidentList incidents={filteredIncidents} onViewDetails={handleViewDetails} />;
    if (viewMode === "map") return <IncidentMap incidents={filteredIncidents} />;
    return null;
  };

  return (
    <div className="flex-1 bg-gray-50/50 min-h-screen p-6 md:p-10 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">All Reported Incidents</h1>
          <p className="text-lg text-gray-600 mt-1">
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
            <List size={18} className="mr-2" />
            List View
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`flex items-center px-4 py-2 rounded-md font-medium transition-all ${
              viewMode === "map" ? "bg-white text-indigo-600 shadow" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Map size={18} className="mr-2" />
            Map View
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Reports" value={isLoading ? "..." : dashboardStats.totalReports} icon={<BarChart className="text-indigo-500" />} />
        <StatCard title="Reports Pending" value={isLoading ? "..." : dashboardStats.pendingReports} icon={<AlertOctagon className="text-yellow-500" />} />
        <StatCard title="Cases Resolved" value={isLoading ? "..." : dashboardStats.resolvedReports} icon={<CheckCircle className="text-green-500" />} />
      </div>

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
            <option>In Progress</option>
            <option>Resolved</option>
          </FilterDropdown>

          <FilterDropdown label="Incident Type" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option>All</option>
            <option>Verbal Harassment</option>
            <option>Physical Assault</option>
            <option>Discrimination</option>
            <option>Stalking</option>
            <option>Unsafe Area</option>
          </FilterDropdown>

          <FilterDropdown label="Sort By" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </FilterDropdown>
        </div>
      </div>

      <div>{renderContent()}</div>

      {selectedIncident && <IncidentDetailModal incident={selectedIncident} onClose={handleCloseModal} />}
    </div>
  );
}

// --- Sub-Components ---

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

function IncidentMap({ incidents }) {
  const defaultPosition = [23.8103, 90.4125];
  const mapKey = incidents.map((i) => i.id).join("-");

  return (
    <div className="h-[600px] w-full rounded-2xl shadow-xl overflow-hidden">
      <MapContainer key={mapKey} center={defaultPosition} zoom={12} scrollWheelZoom className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {incidents.map((incident) => (
          <Marker key={incident.id} position={incident.coords}>
            <Popup>
              <div className="font-sans">
                <h3 className="font-bold text-md">{incident.type}</h3>
                <p className="text-sm text-gray-700">{incident.location}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(incident.date).toLocaleString()}</p>
                <StatusBadge status={incident.status} className="mt-2" />
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
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
        <p className="text-sm text-gray-500 mb-4">
          <span className="font-medium text-gray-600">Reported:</span> {new Date(incident.date).toLocaleDateString()}
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
    "In Progress": "bg-blue-100 text-blue-800 border-blue-200",
    Resolved: "bg-green-100 text-green-800 border-green-200",
  };
  return <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${styles[status] || "bg-gray-100 text-gray-800"} ${className}`}>{status}</span>;
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

function IncidentDetailModal({ incident, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={onClose}>
      <div className="w-full max-w-lg h-full bg-white shadow-2xl flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Incident Details</h2>
            <p className="text-sm text-gray-500">ID: {incident.id}</p>
          </div>
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
