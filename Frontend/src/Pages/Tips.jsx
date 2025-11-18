// src/pages/Tips.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { AlertTriangle } from "lucide-react";

export default function Tips() {
  const { api } = useAuth();
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTips = async () => {
      setLoading(true);
      try {
        const res = await api.get("/tips/get-all-tips/");
        setTips(res.data.data || []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.detail || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, [api]);

  if (error) return <ErrorCard message={error} />;

  return (
    <div className="p-6 mt-20 md:p-10 min-h-screen ">
      <h1 className="text-3xl md:text-4xl font-bold text-indigo-600 mb-6">
        Safety & Awareness Tips
      </h1>
      <p className="text-gray-600 mb-8">
        Learn best practices and stay safe with our curated tips.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <TipCardSkeleton key={i} />)
          : tips.map((tip) => <TipCard key={tip.id} tip={tip} />)}
      </div>

      {!loading && !tips.length && (
        <div className="text-center py-16 text-gray-500 text-lg">
          No tips available at the moment.
        </div>
      )}
    </div>
  );
}

// ---------------- Subcomponents ----------------

function TipCard({ tip }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col hover:scale-[1.03] hover:shadow-2xl transition-all duration-300">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">{tip.title}</h2>
      <p className="text-gray-700 flex-1 line-clamp-5">{tip.description}</p>
      {tip.link && (
        <a
          href={tip.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 text-blue-600 font-medium hover:underline"
        >
          Learn More
        </a>
      )}
    </div>
  );
}

function TipCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg animate-pulse flex flex-col">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mt-auto"></div>
    </div>
  );
}

function ErrorCard({ message }) {
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
