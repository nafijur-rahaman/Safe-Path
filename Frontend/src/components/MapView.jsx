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

// Dummy data
const dummyHotspots = [
  {
    id: 1,
    incidentType: "physical_assault",
    description: "Person was shoved by shopkeeper",
    dateTime: "2025-11-17T17:37",
    location: {
      latitude: 23.81443,
      longitude: 90.35582,
      displayName: "23.80597, 90.36778",
    },
    reporter: { anonymous: true },
    submittedAt: "2025-11-17T11:37:29.315Z",
    status: "pending",
  },
  {
    id: 2,
    incidentType: "verbal_harassment",
    description: "Inappropriate remarks by bus conductor",
    dateTime: "2025-11-16T09:15",
    location: {
      latitude: 23.7801,
      longitude: 90.4072,
      displayName: "23.7801, 90.4072",
    },
    reporter: { anonymous: true },
    submittedAt: "2025-11-16T08:50:29.315Z",
    status: "resolved",
  },
  {
    id: 3,
    incidentType: "unsafe_area",
    description: "Dark pathway, no lights",
    dateTime: "2025-11-15T21:15",
    location: {
      latitude: 23.7935,
      longitude: 90.4183,
      displayName: "Gulshan Lake Park",
    },
    reporter: { anonymous: true },
    submittedAt: "2025-11-15T20:50:29.315Z",
    status: "in_progress",
  },
];

// Fly to selected report
function FlyToLocation({ position, zoom = 16 }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, zoom);
  }, [position, map, zoom]);
  return null;
}

function MapView({ selectedLocation }) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setCurrentLocation([pos.coords.latitude, pos.coords.longitude]),
      () => setCurrentLocation([23.8103, 90.4125])
    );
  }, []);

  const goToCurrentLocation = () => {
    if (!navigator.geolocation || !mapRef.current) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coords = [latitude, longitude];

        setCurrentLocation(coords);
        mapRef.current.flyTo(coords, 16, { duration: 1.5 });
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to get your current location.");
      }
    );
  };

  if (!currentLocation)
    return (
      <div className="flex items-center justify-center h-full">
        Loading map...
      </div>
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

        {dummyHotspots.map((report) => (
          <Circle
            key={report.id}
            center={[report.location.latitude, report.location.longitude]}
            radius={60}
            pathOptions={{
              color:
                report.status === "pending"
                  ? "red"
                  : report.status === "in_progress"
                  ? "orange"
                  : "green",
              fillOpacity: 0.4,
            }}
          >
            <Popup>
              <div className="font-sans">
                <h3 className="font-bold text-md">{report.incidentType}</h3>
                <p className="text-sm">{report.location.displayName}</p>
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>

      <button
        id="locate-btn"
        onClick={goToCurrentLocation}
        className="absolute bottom-4 left-4 z-[1000] bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg"
        title="Current Location"
      >
        <LocateFixed size={20} />
      </button>
    </div>
  );
}

// Main Dashboard
export default function LiveDashboard() {
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <section id="live-dashboard" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">
          Live Safety Dashboard
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          This map and feed are generated 100% from anonymous user reports. See
          the patterns as they emerge.
        </p>

        <div className="flex flex-col lg:flex-row gap-8 w-full h-[70vh] max-h-[800px]">
          {/* Map */}
          <div className="lg:w-2/3 h-full rounded-xl shadow-2xl overflow-hidden border-2 border-gray-200">
            <MapView selectedLocation={selectedLocation} />
          </div>

          {/* Feed & Legend */}
          <div className="lg:w-1/3 h-full flex flex-col gap-8">
            {/* Legend */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                Map Legend
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-500 opacity-50 border border-red-300"></div>
                  <span className="text-gray-600">
                    Pending / High Report Area
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-500 opacity-50 border border-orange-300"></div>
                  <span className="text-gray-600">
                    In Progress / Medium Report Area
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 opacity-50 border border-green-300"></div>
                  <span className="text-gray-600">
                    Resolved / Low Report Area
                  </span>
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
              <h3 className="text-2xl font-semibold mb-5 text-gray-900">
                Recent Anonymous Reports
              </h3>
              <div className="space-y-5">
                {dummyHotspots
                  .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
                  .map((report) => (
                    <div
                      key={report.id}
                      onClick={() =>
                        setSelectedLocation([
                          report.location.latitude,
                          report.location.longitude,
                        ])
                      }
                      className="cursor-pointer hover:bg-gray-100 transition-all flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                    >
                      <div className="flex-shrink-0 mt-1">
                        <AlertTriangle
                          size={20}
                          className={`${
                            report.status === "pending"
                              ? "text-red-600"
                              : report.status === "in_progress"
                              ? "text-orange-600"
                              : "text-green-600"
                          }`}
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {report.incidentType.replace("_", " ")}
                        </h4>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <Clock size={14} />
                          {new Date(report.dateTime).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {report.description}
                        </p>
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
