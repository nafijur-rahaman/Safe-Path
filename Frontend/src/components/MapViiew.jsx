import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { LocateFixed } from "lucide-react";
import "leaflet/dist/leaflet.css";

function FlyToLocation({ position }) {
  const map = useMap();
  if (position) map.flyTo(position, 18);
  return null;
}

export default function MapView() {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
      () => setPosition([23.810331, 90.412521]) // fallback
    );
  }, []);

  const getMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.log(err)
    );
  };

  if (!position)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading map...
      </div>
    );

  return (
    <div className="relative h-screen w-full">
      {/* Button Component */}
      <div className="absolute bottom-4 left-10 z-50">
        <button onClick={getMyLocation}
        className="backdrop-blur-sm rounded-2xl p-2 cursor-pointer"
        >
          <LocateFixed size={20} />
        </button>
      </div>

      {/* Map */}
      <MapContainer center={position} zoom={18} className="h-full w-full z-0">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        //   attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />
        <FlyToLocation position={position} />
        <Marker position={position}>
          <Popup>You are here!</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
