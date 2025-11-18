import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import {
  Search,
  LocateFixed,
  Shield,
  ArrowLeft,
  ArrowRight,
  Check,
  List,
  Calendar,
  MapPin,
  FileText,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Leaflet icons fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// --- Map Events ---
function MapEvents({ setPosition, setFormData }) {
  useMapEvents({
    click: async (e) => {
      const newPos = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPos[0]}&lon=${newPos[1]}`
        );
        const data = await res.json();
        const displayName =
          data.display_name ||
          `${newPos[0].toFixed(5)}, ${newPos[1].toFixed(5)}`;
        setFormData((prev) => ({ ...prev, location: displayName }));
      } catch {
        setFormData((prev) => ({
          ...prev,
          location: `${newPos[0].toFixed(5)}, ${newPos[1].toFixed(5)}`,
        }));
      }
    },
  });
  return null;
}

// --- Map Fly To ---
function MapFlyTo({ position }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, 15, { animate: true, duration: 1.5 });
  }, [position, map]);
  return null;
}

// --- Stepper ---
const Stepper = ({ currentStep }) => {
  const steps = ["Incident Details", "Location & Time", "Review & Submit"];
  return (
    <div className="flex items-center w-full mb-10">
      {steps.map((label, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                currentStep > index
                  ? "bg-blue-600 text-white"
                  : currentStep === index + 1
                  ? "bg-blue-600 text-white ring-4 ring-blue-200"
                  : "bg-gray-100 border-2 border-gray-300 text-gray-500"
              }`}
            >
              {currentStep > index ? <Check size={24} /> : index + 1}
            </div>
            <span
              className={`mt-2 text-xs font-semibold text-center ${
                currentStep >= index + 1 ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-1 mx-4 transition-colors duration-300 ${
                currentStep > index + 1 ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// --- Main Component ---
export default function ReportComplaint() {
  const [formData, setFormData] = useState({
    incidentType: "",
    dateTime: "",
    description: "",
    location: "",
  });
  const [markerPosition, setMarkerPosition] = useState([23.810331, 90.412521]);
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = [pos.coords.latitude, pos.coords.longitude];
        setMarkerPosition(newPos);
        setFormData((prev) => ({
          ...prev,
          location: `${newPos[0].toFixed(5)}, ${newPos[1].toFixed(5)}`,
        }));
      },
      () => {}
    );
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  // Submit report
  // This function no longer needs 'e.preventDefault()' since it's
  // not tied to a form 'onSubmit' event, but it doesn't hurt to keep.
  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); // Good practice to keep, just in case
    const reportData = {
      incidentType: formData.incidentType,
      description: formData.description,
      dateTime: formData.dateTime,
      location: {
        latitude: markerPosition[0],
        longitude: markerPosition[1],
        displayName: formData.location,
      },
      reporter: { anonymous: true },
      submittedAt: new Date().toISOString(),
      status: "pending",
    };
    console.log(reportData);
    // fetch("/api/reports", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(reportData) });
    setFormData({
      incidentType: "",
      dateTime: "",
      description: "",
      location: "",
    });
    setStep(1);
    alert("Report submitted successfully!");
  };

  // Search location
  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`
      );
      const data = await res.json();
      if (data?.length) {
        const { lat, lon, display_name } = data[0];
        const newPos = [parseFloat(lat), parseFloat(lon)];
        setMarkerPosition(newPos);
        setFormData((prev) => ({ ...prev, location: display_name }));
      } else alert("Location not found");
    } catch {
      alert("Failed to search location");
    }
  };

  const goToCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = [pos.coords.latitude, pos.coords.longitude];
        setMarkerPosition(newPos);
        setFormData((prev) => ({
          ...prev,
          location: `${newPos[0].toFixed(5)}, ${newPos[1].toFixed(5)}`,
        }));
      },
      (err) => console.log(err)
    );
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="w-full min-h-screen p-4 md:p-8 bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row gap-8">
        <div className="w-full lg:w-3/5 h-[450px] lg:h-[80vh] rounded-2xl overflow-hidden shadow-2xl">
          <MapContainer
            center={markerPosition}
            zoom={13}
            scrollWheelZoom
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={markerPosition} />
            <MapEvents
              setPosition={setMarkerPosition}
              setFormData={setFormData}
            />
            <MapFlyTo position={markerPosition} />
          </MapContainer>
        </div>

        <div className="w-full lg:w-2/5 bg-white p-6 sm:p-8 shadow-2xl rounded-2xl lg:h-[90vh] flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Report an Incident
          </h1>
          <p className="text-gray-600 mb-8">
            Help make your community safer. Your report is anonymous.
          </p>

          <Stepper currentStep={step} />

          {/* CHANGE 1: This is now a <div> instead of a <form>.
            This prevents all default browser submission behavior.
          */}
          <div className="flex flex-col flex-1 justify-between">
            <div className="flex-1">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <IconSelect
                      label="Type of Incident"
                      name="incidentType"
                      value={formData.incidentType}
                      onChange={handleChange}
                      icon={<List size={18} />}
                    >
                      <option value="" disabled>
                        Select a type...
                      </option>
                      <option value="verbal_harassment">
                        Verbal Harassment
                      </option>
                      <option value="physical_assault">Physical Assault</option>
                      <option value="discrimination">Discrimination</option>
                      <option value="stalking">Stalking</option>
                      <option value="unsafe_area">
                        Unsafe Area / Poor Lighting
                      </option>
                      <option value="other">Other</option>
                    </IconSelect>
                    <IconTextarea
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe what happened..."
                      icon={<FileText size={18} />}
                    />
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <IconInput
                      label="Date & Time"
                      name="dateTime"
                      type="datetime-local"
                      value={formData.dateTime}
                      onChange={handleChange}
                      icon={<Calendar size={18} />}
                    />
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <p className="text-xs text-gray-500 mb-3">
                        Click map, search, or use current location.
                      </p>
                      <div className="flex space-x-2 mb-2">
                        {/* CHANGE 2: Added onKeyDown to the search input.
                          This makes "Enter" trigger the search, which is
                          good user experience. It won't submit the form
                          because the <form> tag is gone.
                        */}
                        <input
                          type="text"
                          placeholder="Search location..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleSearch();
                            }
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={handleSearch}
                          className="bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Search size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={goToCurrentLocation}
                          className="bg-green-600 text-white p-2.5 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <LocateFixed size={18} />
                        </button>
                      </div>
                      <IconInput
                        name="location"
                        type="text"
                        value={formData.location}
                        readOnly
                        placeholder="Location will appear here"
                        icon={<MapPin size={18} />}
                        isReadOnly
                      />
                    </div>
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-semibold text-gray-800">
                      Review Report
                    </h3>
                    <div className="flex items-center space-x-3 bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg">
                      <Shield size={24} />
                      <span className="text-sm font-medium">
                        Your report is <strong>anonymous</strong>. Confirm
                        details before submitting.
                      </span>
                    </div>
                    <dl className="space-y-4 border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between">
                        <dt className="font-medium text-gray-500">Type:</dt>
                        <dd className="text-gray-800 text-right">
                          {formData.incidentType || "N/A"}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-gray-500">
                          Date/Time:
                        </dt>
                        <dd className="text-gray-800 text-right">
                          {formData.dateTime
                            ? new Date(formData.dateTime).toLocaleString()
                            : "N/A"}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-gray-500">Location:</dt>
                        <dd className="text-gray-800 text-right max-w-xs truncate">
                          {formData.location || "N/A"}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium text-gray-500 mb-1">
                          Description:
                        </dt>
                        <div className="text-gray-800 text-left text-sm bg-gray-50 p-2 rounded">
                          {formData.description || "N/A"}
                        </div>
                      </div>
                    </dl>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={prevStep}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    step === 1
                      ? "opacity-0 invisible"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <ArrowLeft size={16} /> Back
                </button>
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
                  >
                    Next <ArrowRight size={16} />
                  </button>
                ) : (
                  /* CHANGE 3: This button is now 'type="button"'
                    and explicitly calls 'handleSubmit' onClick.
                    This is now the *only* way the form can be submitted.
                  */
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg transition-all"
                  >
                    <Shield size={16} /> Submit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Reusable Inputs ---
const IconInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  isReadOnly = false,
}) => (
  <div>
    {label && (
      <label className="block mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>
    )}
    <div className="relative flex items-center group">
      <span className="absolute left-3 text-gray-400 group-focus-within:text-indigo-600">
        {icon}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={isReadOnly}
        className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          isReadOnly ? "bg-gray-100 cursor-not-allowed" : "bg-white"
        }`}
        required
      />
    </div>
  </div>
);

const IconSelect = ({ label, name, value, onChange, icon, children }) => (
  <div>
    <label className="block mb-2 text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="relative flex items-center group">
      <span className="absolute left-3 text-gray-400 group-focus-within:text-indigo-600">
        {icon}
      </span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white appearance-none"
        required
      >
        {children}
      </select>
    </div>
  </div>
);

const IconTextarea = ({ label, name, value, onChange, placeholder, icon }) => (
  <div>
    <label className="block mb-2 text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="relative group">
      <span className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-indigo-600">
        {icon}
      </span>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        required
      />
    </div>
  </div>
);