// src/Pages/ReportComplaint.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
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
  Edit2,
  Trash2,
} from "lucide-react";
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


const useGeoLocation = () => {
  const [coords, setCoords] = useState([23.81033, 90.412521]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords([pos.coords.latitude, pos.coords.longitude]),
      () => {}
    );
  }, []);

  return { coords, setCoords };
};

const useReverseGeocode = () => {
  const fetchAddress = useCallback(async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await res.json();
      return data.display_name || `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
    } catch {
      return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
    }
  }, []);

  return { fetchAddress };
};

function MapEvents({ setPosition, setAddress }) {
  const { fetchAddress } = useReverseGeocode();

  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      const newPos = [lat, lng];
      setPosition(newPos);
      const address = await fetchAddress(lat, lng);
      setAddress(address);
    },
  });
  return null;
}

function MapFlyTo({ position }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, 15, { animate: true, duration: 1.3 });
  }, [position, map]);
  return null;
}


const Stepper = ({ currentStep }) => {
  const steps = useMemo(
    () => ["Incident Details", "Location & Time", "Review & Submit"],
    []
  );

  return (
    <div className="flex items-center w-full mb-10">
      {steps.map((label, idx) => {
        const isActive = currentStep === idx + 1;
        const isCompleted = currentStep > idx;

        return (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                  isCompleted
                    ? "bg-blue-600 text-white"
                    : isActive
                    ? "bg-blue-600 text-white ring-4 ring-blue-200"
                    : "bg-gray-100 border border-gray-300 text-gray-500"
                }`}
              >
                {isCompleted ? <Check size={24} /> : idx + 1}
              </div>
              <span
                className={`mt-2 text-xs font-semibold ${
                  currentStep >= idx + 1 ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {label}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-4 ${
                  currentStep > idx + 1 ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};


export default function ReportComplaint() {
  const { coords, setCoords } = useGeoLocation();
  const { api } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    incidentType: "",
    dateTime: "",
    description: "",
    location: "",
  });

  const [reports, setReports] = useState([]);
  const [editingReport, setEditingReport] = useState(null);

  const stepVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  const updateAddress = useCallback((address) => {
    setFormData((prev) => ({ ...prev, location: address }));
  }, []);


  const fetchReports = useCallback(async () => {
    try {
      const res = await api.get("/report/get-all-reports/");
      const data = res.data.results || [];
      setReports(data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to fetch reports.");
    }
  }, [api]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);


  const handleSubmit = async () => {
    if (!formData.incidentType || !formData.dateTime || !formData.description) {
      return alert("Please fill all required fields.");
    }

    const payload = {
      incident_type: formData.incidentType,
      description: formData.description,
      date_time: formData.dateTime,
      location: {
        latitude: coords[0],
        longitude: coords[1],
        display_name: formData.location,
      },
      status: "pending",
    };

    setLoading(true);
    try {
      if (editingReport) {
        await api.put(`/report/${editingReport.id}/update/`, payload);
        alert("Report updated successfully!");
      } else {
        await api.post("/report/create/", payload);
        alert("Report submitted successfully!");
      }

      setFormData({
        incidentType: "",
        dateTime: "",
        description: "",
        location: "",
      });
      setStep(1);
      setEditingReport(null);
      fetchReports();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to submit report.");
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      await api.delete(`/report/${reportId}/delete/`);
      alert("Report deleted successfully!");
      fetchReports();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to delete report.");
    }
  };


  const handleEdit = (report) => {
    setFormData({
      incidentType: report.incident_type,
      dateTime: report.date_time,
      description: report.description,
      location: report.location.display_name,
    });
    setCoords([report.location.latitude, report.location.longitude]);
    setStep(1);
    setEditingReport(report);
  };

 
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`
      );
      const data = await res.json();
      if (!data?.length) return alert("Location not found");

      const { lat, lon, display_name } = data[0];
      const newPos = [parseFloat(lat), parseFloat(lon)];
      setCoords(newPos);
      setFormData((prev) => ({ ...prev, location: display_name }));
    } catch {
      alert("Search failed.");
    }
  }, [searchQuery, setCoords]);

  const goToCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = [pos.coords.latitude, pos.coords.longitude];
        setCoords(newPos);
        setFormData((prev) => ({
          ...prev,
          location: `${newPos[0].toFixed(5)}, ${newPos[1].toFixed(5)}`,
        }));
      },
      () => alert("Unable to fetch current location")
    );
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="w-full mt-20 min-h-screen p-4 md:p-8 bg-gray-50">
      {loading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="text-white text-lg font-bold">Submitting...</div>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row gap-8">
        {/* MAP */}
        <div className="w-full lg:w-3/5 h-[450px] lg:h-[80vh] rounded-2xl overflow-hidden shadow-xl">
          <MapContainer center={coords} zoom={13} scrollWheelZoom className="w-full h-full">
            <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={coords} />
            <MapEvents setPosition={setCoords} setAddress={(addr) => setFormData((f) => ({ ...f, location: addr }))} />
            <MapFlyTo position={coords} />
          </MapContainer>
        </div>

        {/* FORM + REPORT LIST */}
        <div className="w-full lg:w-2/5 flex flex-col gap-6">
          <div className="bg-white p-8 shadow-2xl rounded-2xl flex flex-col lg:h-[90vh]">
            <h1 className="text-3xl font-bold mb-2">{editingReport ? "Edit Report" : "Report an Incident"}</h1>
            <p className="text-gray-600 mb-8">Your report is 100% anonymous.</p>

            <Stepper currentStep={step} />

            <div className="flex flex-col flex-1">
              <AnimatePresence mode="wait">
                {/* STEP 1 */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6 flex flex-col h-full"
                  >
                    <IconSelect
                      label="Incident Type"
                      name="incidentType"
                      value={formData.incidentType}
                      onChange={(e) => setFormData({ ...formData, incidentType: e.target.value })}
                      icon={<List size={18} />}
                    >
                      <option value="" disabled>Select a type...</option>
                      <option value="verbal_harassment">Verbal Harassment</option>
                      <option value="physical_assault">Physical Assault</option>
                      <option value="discrimination">Discrimination</option>
                      <option value="stalking">Stalking</option>
                      <option value="unsafe_area">Unsafe Area</option>
                      <option value="other">Other</option>
                    </IconSelect>

                    <IconTextarea
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe what happened..."
                      icon={<FileText size={18} />}
                    />

                    <div className="mt-auto pt-6 border-t flex justify-between">
                      <div></div>
                      <button onClick={nextStep} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg flex items-center gap-2">
                        Next <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6 flex flex-col h-full"
                  >
                    <IconInput
                      label="Date & Time"
                      name="dateTime"
                      type="datetime-local"
                      value={formData.dateTime}
                      onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                      icon={<Calendar size={18} />}
                    />

                    <div>
                      <label className="block mb-2 text-sm font-medium">Location</label>
                      <p className="text-xs text-gray-500 mb-3">Click map, search, or use current location.</p>

                      <div className="flex space-x-2 mb-2">
                        <input
                          type="text"
                          placeholder="Search address..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                          className="flex-1 px-4 py-2 border rounded-lg"
                        />
                        <button onClick={handleSearch} className="bg-blue-600 text-white p-3 rounded-lg">
                          <Search size={18} />
                        </button>
                        <button onClick={goToCurrentLocation} className="bg-green-600 text-white p-3 rounded-lg">
                          <LocateFixed size={18} />
                        </button>
                      </div>

                      <IconInput
                        name="location"
                        value={formData.location}
                        icon={<MapPin size={18} />}
                        readOnly
                        placeholder="Location will appear here"
                        isReadOnly
                      />
                    </div>

                    <div className="mt-auto pt-6 border-t flex justify-between">
                      <button onClick={prevStep} className="px-5 py-2.5 rounded-lg flex items-center gap-2 border bg-white border-gray-300 hover:bg-gray-100">
                        <ArrowLeft size={16} /> Back
                      </button>

                      <button onClick={nextStep} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg flex items-center gap-2">
                        Next <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6 flex flex-col h-full"
                  >
                    <h3 className="text-xl font-semibold">Review Information</h3>

                    <div className="flex items-center gap-3 bg-blue-50 text-blue-800 p-4 rounded-lg border">
                      <Shield size={24} />
                      <span>Your report is anonymous. Please confirm details.</span>
                    </div>

                    <dl className="space-y-4 border rounded-lg p-4 bg-gray-50">
                      <InfoRow label="Type" value={formData.incidentType} />
                      <InfoRow label="Date/Time" value={formData.dateTime ? new Date(formData.dateTime).toLocaleString() : "N/A"} />
                      <InfoRow label="Location" value={formData.location} />
                      <div>
                        <dt className="font-medium text-gray-600">Description</dt>
                        <dd className="p-2 bg-white rounded">{formData.description || "N/A"}</dd>
                      </div>
                    </dl>

                    <div className="mt-auto pt-6 border-t flex justify-between">
                      <button onClick={prevStep} className="px-5 py-2.5 rounded-lg flex items-center gap-2 border bg-white border-gray-300 hover:bg-gray-100">
                        <ArrowLeft size={16} /> Back
                      </button>

                      <button onClick={handleSubmit} className="px-5 py-2.5 bg-green-600 text-white rounded-lg flex items-center gap-2">
                        <Shield size={16} /> {editingReport ? "Update" : "Submit"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


const InfoRow = ({ label, value }) => (
  <div className="flex justify-between">
    <dt className="font-medium text-gray-600">{label}</dt>
    <dd className="text-gray-900 max-w-xs text-right truncate">{value}</dd>
  </div>
);

const IconInput = ({ label, name, type, value, onChange, placeholder, icon, readOnly, isReadOnly }) => (
  <div>
    {label && <label className="block mb-1 text-sm">{label}</label>}
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={isReadOnly}
        placeholder={placeholder}
        className={`w-full pl-10 pr-3 py-2 border rounded-lg ${isReadOnly ? "bg-gray-100" : "bg-white"}`}
      />
    </div>
  </div>
);

const IconSelect = ({ label, name, value, onChange, icon, children }) => (
  <div>
    <label className="block mb-1 text-sm">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
      <select name={name} value={value} onChange={onChange} className="w-full pl-10 pr-4 py-2 border rounded-lg">{children}</select>
    </div>
  </div>
);

const IconTextarea = ({ label, name, value, onChange, placeholder, icon }) => (
  <div>
    <label className="block mb-1 text-sm">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-3 text-gray-400">{icon}</span>
      <textarea rows="4" name={name} value={value} onChange={onChange} placeholder={placeholder} className="w-full pl-10 pr-3 py-2 border rounded-lg" />
    </div>
  </div>
);
