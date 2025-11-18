import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext"
import { Trash2, Edit, Plus } from "lucide-react";

const AllTips = () => {
  const { api } = useAuth();
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTip, setCurrentTip] = useState(null); // null for new tip
  const [form, setForm] = useState({ title: "", description: "" });

  // Fetch tips
  const fetchTips = async () => {
    try {
      const res = await api.get("tips/get-all-tips/");
      setTips(res.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch tips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, []);

  // Delete tip
  const deleteTip = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tip?")) return;
    try {
      await api.delete(`tips/${id}/delete/`);
      setTips((prev) => prev.filter((tip) => tip.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete tip");
    }
  };

  // Open modal for add or edit
  const openModal = (tip = null) => {
    setCurrentTip(tip);
    setForm({ title: tip?.title || "", description: tip?.description || "" });
    setModalOpen(true);
  };

  // Handle form change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Save tip (add or edit)
  const saveTip = async (e) => {
    e.preventDefault();
    try {
      if (currentTip) {
        const res = await api.put(`tips/${currentTip.id}/update/`, form);
        setTips((prev) => prev.map((t) => (t.id === currentTip.id ? res.data : t)));
      } else {
        const res = await api.post("tips/create-tip/", form);
        setTips((prev) => [res.data, ...prev]);
      }
      setModalOpen(false);
      setCurrentTip(null);
      setForm({ title: "", description: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to save tip");
    }
  };

  if (loading) return <div className="p-8 text-gray-600">Loading safety tips...</div>;

  return (
    <div className="p-8 space-y-8">
      {/* Header + Add Tip */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 bg-clip-text">
          Safety Tips Managements
        </h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold rounded-lg shadow hover:shadow-lg transition"
        >
          <Plus size={18} /> Add Tip
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {/* Tips Grid */}
      {tips.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center text-gray-500">
          No tips added yet. Start creating safety advice.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip) => (
            <div
              key={tip.id}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-2xl transition flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-bold mb-2 text-gray-800">{tip.title}</h2>
                <p className="text-gray-600 mb-3 line-clamp-3">{tip.description}</p>
                <p className="text-gray-400 text-sm">
                  Created by <span className="font-medium">{tip.created_by.username}</span> •{" "}
                  {new Date(tip.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => openModal(tip)}
                  className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                >
                  <Edit size={16} /> Edit
                </button>
                <button
                  onClick={() => deleteTip(tip.id)}
                  className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Add/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {currentTip ? "Edit Tip" : "Add Tip"}
            </h2>
            <form className="space-y-4" onSubmit={saveTip}>
              <div>
                <label className="block text-gray-700 mb-1 font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1 font-medium">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 transition"
                  rows={5}
                  required
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg shadow hover:shadow-lg transition font-medium"
                >
                  {currentTip ? "Update Tip" : "Add Tip"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTips;
