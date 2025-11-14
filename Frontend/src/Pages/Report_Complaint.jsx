import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { Search, LocateFixed } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function ReportComplaint() {
  const [formData, setFormData] = useState({
    name: "",
    nid: "",
    contact: "",
    description: "",
    location: "",
  });

  const [markerPosition, setMarkerPosition] = useState([23.810331, 90.412521]); // Default Dhaka
  const [searchQuery, setSearchQuery] = useState("");

  // Optional: get initial geolocation
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setMarkerPosition([pos.coords.latitude, pos.coords.longitude]),
      () => {} // fallback to default
    );
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Complaint submitted!\nName: ${formData.name}\nNID: ${formData.nid}\nContact: ${formData.contact}\nDescription: ${formData.description}\nLocation: ${formData.location}`
    );
    setFormData({ name: "", nid: "", contact: "", description: "", location: "" });
  };

  // Handle map clicks
  const LocationMarker = ({ setMarkerPosition, setFormData }) => {
    const map = useMap();
    map.on("click", (e) => {
      setMarkerPosition([e.latlng.lat, e.latlng.lng]);
      setFormData({
        ...formData,
        location: `${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`,
      });
    });
    return <Marker position={markerPosition} />;
  };

  // Move map to marker position whenever it changes
  const MapUpdater = ({ position }) => {
    const map = useMap();
    map.setView(position, map.getZoom(), { animate: true });
    return null;
  };

  // Search location using Nominatim
  const handleSearch = async () => {
    if (!searchQuery) return;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data && data.length > 0) {
      const { lat, lon, display_name } = data[0];
      const newPos = [parseFloat(lat), parseFloat(lon)];
      setMarkerPosition(newPos);
      setFormData({ ...formData, location: display_name });
    } else {
      alert("Location not found");
    }
  };

  // Jump to user's current location
  const goToCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = [pos.coords.latitude, pos.coords.longitude];
        setMarkerPosition(newPos);
        setFormData({
          ...formData,
          location: `${newPos[0].toFixed(5)}, ${newPos[1].toFixed(5)}`,
        });
      },
      (err) => console.log(err)
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-b from-gray-100 via-gray-50 to-white">
      {/* Left: Form */}
      <div className="md:w-1/2 p-8 overflow-y-auto max-h-screen">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">
            Report a Complaint
          </h1>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <InputField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
            />
            <InputField
              label="NID Number"
              name="nid"
              value={formData.nid}
              onChange={handleChange}
              placeholder="1234567890"
            />
            <InputField
              label="Contact Number"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="+880 1XXXXXXXXX"
            />
            <TextareaField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your complaint in detail..."
            />

            {/* Location Search */}
            <div>
              <label className="block mb-2 text-gray-600 font-medium">
                Location
              </label>
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Search location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="bg-blue-500 text-white px-4 py-3 rounded-xl hover:bg-blue-600 transition-colors flex items-center"
                >
                  <Search className="mr-2" size={18} /> Search
                </button>
                <button
                  type="button"
                  onClick={goToCurrentLocation}
                  className="bg-green-500 text-white px-4 py-3 rounded-xl hover:bg-green-600 transition-colors flex items-center"
                >
                  <LocateFixed className="mr-2" size={18} /> My Location
                </button>
              </div>
              <input
                type="text"
                name="location"
                value={formData.location}
                readOnly
                placeholder="Location will appear here"
                className="w-full p-3 border border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed"
              />
            </div>

            <button className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
              Submit Complaint
            </button>
          </form>
        </div>
      </div>

      {/* Right: Map */}
      <div className="md:w-1/2 md:h-screen sticky top-0">
        <MapContainer
          center={markerPosition}
          zoom={13}
          scrollWheelZoom={true}
          className="w-full h-screen rounded-2xl shadow-2xl"
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker
            setMarkerPosition={setMarkerPosition}
            setFormData={setFormData}
          />
          <MapUpdater position={markerPosition} />
        </MapContainer>
      </div>
    </div>
  );
}

// Reusable input field
const InputField = ({ label, name, value, onChange, placeholder }) => (
  <div>
    <label className="block mb-2 font-medium text-gray-700">{label}</label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
      required
    />
  </div>
);

// Reusable textarea
const TextareaField = ({ label, name, value, onChange, placeholder }) => (
  <div>
    <label className="block mb-2 font-medium text-gray-700">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={5}
      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
      required
    />
  </div>
);
