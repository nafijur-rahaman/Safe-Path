// src/Pages/LiveDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  Popup,
  useMap,
} from "react-leaflet";
import { LocateFixed, Clock, AlertTriangle } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { useAuth } from "../context/AuthContext";

// Fly to selected report
function FlyToLocation({ position, zoom = 16 }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, zoom);
  }, [position, map, zoom]);
  return null;
}

function MapView({ selectedLocation, reports }) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setCurrentLocation([pos.coords.latitude, pos.coords.longitude]),
      () => setCurrentLocation([23.8103, 90.4125]) // fallback
    );
  }, []);

  const goToCurrentLocation = () => {
    if (!navigator.geolocation || !mapRef.current) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = [position.coords.latitude, position.coords.longitude];
        setCurrentLocation(coords);
        mapRef.current.flyTo(coords, 16, { duration: 1.5 });
      },
      () => alert("Unable to get your current location.")
    );
  };

  if (!currentLocation)
    return (
      <div className="flex items-center justify-center h-full">Loading map...</div>
    );

  return (
    <div className="relative h-full w-full overflow-hidden">
      <MapContainer
        center={currentLocation}
        zoom={14}
        className="h-full w-full"
        whenCreated={(map) => (mapRef.current = map)}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {selectedLocation && <FlyToLocation position={selectedLocation} />}

        <Marker position={currentLocation}>
          <Popup>You are here!</Popup>
        </Marker>

        {reports.map((report) => (
          <Circle
            key={report.id}
            center={[report.location.latitude, report.location.longitude]}
            radius={60}
            pathOptions={{
              color:
                report.status === "accepted"
                  ? "red"
                  : report.status === "resolved"
                  ? "green"
                  : "gray",
              fillOpacity: 0.4,
            }}
          >
            <Popup>
              <div className="font-sans">
                <h3 className="font-bold text-md">{report.incident_type.replace("_", " ")}</h3>
                <p className="text-sm">{report.location.display_name}</p>
                <p className="text-xs mt-1 font-medium">
                  Status: {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                </p>
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>

      <button
        onClick={goToCurrentLocation}
        className="absolute bottom-4 left-4 z-[1000] bg-indigo-500 hover:bg-indigo-600 text-white rounded-full p-3 shadow-lg"
        title="Current Location"
      >
        <LocateFixed size={20} />
      </button>
    </div>
  );
}

export default function LiveDashboard() {
  const { api } = useAuth();
  const [reports, setReports] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      // Only get reports that admin has accepted
      const res = await api.get("/report/get-all-accepted-reports/");
      const data = res.data.results || [];
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
    <section id="live-dashboard" className="py-24 bg-white">
      {loading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="text-white text-lg font-bold">Loading Reports...</div>
        </div>
      )}
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">Live Safety Dashboard</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          This map and feed are generated 100% from anonymous user reports. See the patterns as they emerge.
        </p>

        <div className="flex flex-col lg:flex-row gap-8 w-full h-[70vh] max-h-[800px]">
          {/* Map */}
          <div className="lg:w-2/3 h-full rounded-xl shadow-2xl overflow-hidden border-2 border-gray-200">
            <MapView selectedLocation={selectedLocation} reports={reports} />
          </div>

          {/* Feed & Legend */}
          <div className="lg:w-1/3 h-full flex flex-col gap-8">
            {/* Legend */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Map Legend</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-500 opacity-50 border border-red-300"></div>
                  <span className="text-gray-600">Accepted / High Report Area</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 opacity-50 border border-green-300"></div>
                  <span className="text-gray-600">Resolved / Low Report Area</span>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png"
                    alt="marker"
                    className="w-3 h-5"
                  />
                  <span className="text-gray-600">Your Location</span>
                </div>
              </div>
            </div>

            {/* Live Feed */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-200 flex-1 overflow-y-auto">
              <h3 className="text-2xl font-semibold mb-5 text-gray-900">Recent Anonymous Reports</h3>
              <div className="space-y-5">
                {reports
                  .sort((a, b) => new Date(b.date_time) - new Date(a.date_time))
                  .map((report) => (
                    <div
                      key={report.id}
                      onClick={() =>
                        setSelectedLocation([report.location.latitude, report.location.longitude])
                      }
                      className="cursor-pointer hover:bg-gray-100 transition-all flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                    >
                      <div className="flex-shrink-0 mt-1">
                        <AlertTriangle
                          size={20}
                          className={`${
                            report.status === "accepted"
                              ? "text-red-600"
                              : report.status === "resolved"
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {report.incident_type.replace("_", " ")}
                        </h4>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <Clock size={14} />
                          {new Date(report.date_time).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{report.description}</p>
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
