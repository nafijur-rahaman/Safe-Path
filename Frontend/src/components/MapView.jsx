// src/Pages/LiveDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Circle,
  Popup,
  Marker,
  useMap,
} from "react-leaflet";
import { LocateFixed, Clock, AlertTriangle } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { useAuth } from "../context/AuthContext";

// Fly to a given position smoothly
function FlyToLocation({ position, zoom = 16 }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, zoom, { duration: 1.2 });
  }, [position, map, zoom]);
  return null;
}

// Go to my location button component
function MyLocationButton({ setCurrentLocation }) {
  const map = useMap();

  const goToMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setCurrentLocation(coords);
        map.flyTo(coords, 16, { duration: 1.5 });
      },
      () => alert("Unable to get your current location.")
    );
  };

  return (
    <button
      onClick={goToMyLocation}
      className="absolute bottom-4 left-4 z-[1000] bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-transform hover:scale-110"
      title="Go to My Location"
    >
      <LocateFixed size={20} />
    </button>
  );
}

// Map View Component
function MapView({ reports, selectedLocation, setSelectedLocation }) {
  const [currentLocation, setCurrentLocation] = useState(null);

  // Get user geolocation
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setCurrentLocation([pos.coords.latitude, pos.coords.longitude]),
      () => setCurrentLocation([23.8103, 90.4125]) // fallback coords
    );
  }, []);

  if (!currentLocation) return <div className="flex items-center justify-center h-full">Loading map...</div>;

  // Incident type colors
  const INCIDENT_COLORS = {
    verbal: "#f97316",
    physical_assault: "#ef4444",
    stalking: "#6366f1",
    discrimination: "#8b5cf6",
    unsafe_area: "#facc15",
    other: "#34d399",
  };

  const STATUS_OPACITY = {
    accepted: 0.5,
    solved: 0.25,
  };

  return (
    <div className="relative h-full w-full rounded-xl shadow-2xl overflow-hidden border-2 border-gray-200">
      <MapContainer
        center={currentLocation}
        zoom={14}
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {selectedLocation && <FlyToLocation position={selectedLocation} />}
        <Marker position={currentLocation}>
          <Popup>You are here!</Popup>
        </Marker>

        {reports
          .filter((r) => r.status === "accepted" || r.status === "solved")
          .map((report) => (
            <Circle
              key={report.id}
              center={[report.location.latitude, report.location.longitude]}
              radius={80}
              pathOptions={{
                color: INCIDENT_COLORS[report.incident_type],
                fillColor: INCIDENT_COLORS[report.incident_type],
                fillOpacity: STATUS_OPACITY[report.status],
              }}
              eventHandlers={{
                click: () =>
                  setSelectedLocation([report.location.latitude, report.location.longitude]),
              }}
            >
              <Popup>
                <div className="font-sans">
                  <h3 className="font-bold text-md">{report.incident_type.replace("_", " ")}</h3>
                  <p className="text-sm">{report.location.display_name}</p>
                  <p className="text-xs mt-1 font-medium">
                    Status: {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </p>
                  <p className="text-xs mt-1">{new Date(report.date_time).toLocaleString()}</p>
                  <p className="text-sm mt-1">{report.description}</p>
                </div>
              </Popup>
            </Circle>
          ))}

        <MyLocationButton setCurrentLocation={setCurrentLocation} />
      </MapContainer>
    </div>
  );
}

// Main Dashboard
export default function LiveDashboard() {
  const { api } = useAuth();
  const [reports, setReports] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get("/report/get-all-reports/"); // fetch all
      const data = res.data.data || [];
      setReports(data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to fetch reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-indigo-600 text-center mb-4">Live Safety Dashboard</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          This map shows accepted and solved reports only. Click a report to navigate its location. Your location is also shown.
        </p>

        <div className="flex flex-col lg:flex-row gap-8 w-full h-[75vh] max-h-[850px]">
          <MapView
            reports={reports}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />

          {/* Sidebar */}
          <div className="lg:w-1/3 flex flex-col gap-6">
            {/* Legend */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-2xl font-semibold mb-4">Legend</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-500 opacity-50 border border-red-300"></div>
                  <span className="text-gray-600">Accepted / Active</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 opacity-30 border border-green-300"></div>
                  <span className="text-gray-600">Solved / Resolved</span>
                </div>
                <div className="flex items-center gap-3">
                  <LocateFixed size={16} />
                  <span className="text-gray-600">Your Location</span>
                </div>
              </div>
            </div>

            {/* Feed */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex-1 overflow-y-auto">
              <h3 className="text-2xl font-semibold mb-5">Recent Reports</h3>
              <div className="space-y-5">
                {reports
                  .filter((r) => r.status === "accepted" || r.status === "solved")
                  .sort((a, b) => new Date(b.date_time) - new Date(a.date_time))
                  .map((report) => (
                    <div
                      key={report.id}
                      onClick={() =>
                        setSelectedLocation([report.location.latitude, report.location.longitude])
                      }
                      className="cursor-pointer hover:bg-gray-50 transition-all flex items-start gap-4 p-4 bg-gray-100 rounded-lg border border-gray-200 shadow-sm"
                    >
                      <div className="flex-shrink-0 mt-1">
                        <AlertTriangle
                          size={20}
                          className={`${
                            report.status === "accepted" ? "text-red-600" : "text-green-600"
                          }`}
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {report.incident_type.replace("_", " ")}
                        </h4>
                        <p className="text-xs text-gray-500 flex items-center gap-2">
                          <Clock size={12} />
                          {new Date(report.date_time).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{report.location.display_name}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
