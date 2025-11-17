// src/pages/HomePage.jsx

import React from "react";
import { Shield, Megaphone, MapPin, AlertTriangle, Clock } from "lucide-react";
import Hero from "../components/Hero";
import MapView from "../components/MapViiew";
import HowItWorks from "../components/HowItWorks";

const HomePage = () => {
  return (
    <div className="bg-white text-gray-900">

      <Hero/>




      <section id="live-dashboard" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">
            Live Safety Dashboard
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            This map and feed are generated 100% from anonymous user
            reports. See the patterns as they emerge.
          </p>
          <div className="flex flex-col lg:flex-row gap-8 w-full h-[70vh] max-h-[800px]">
            
            {/* Left Side: Map */}
            <div className="lg:w-2/3 h-full rounded-xl shadow-2xl overflow-hidden border-2 border-gray-200">
              <MapView />
            </div>

            {/* Right Side: Live Feed & Legend */}
            <div className="lg:w-1/3 h-full flex flex-col gap-8">
              {/* Legend Card */}
              <div className="bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">Map Legend</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-500 opacity-50 border border-red-300"></div>
                    <span className="text-gray-600">High-Report Area</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-500 opacity-30 border border-red-400"></div>
                    <span className="text-gray-600">Low-Report Area</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <img src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png" alt="marker" className="w-3 h-5" />
                    <span className="text-gray-600">Your Location</span>
                  </div>
                </div>
              </div>

              {/* Live Feed Card */}
              <div className="bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-200 flex-1 overflow-y-auto">
                <h3 className="text-2xl font-semibold mb-5 text-gray-900">
                  Recent Anonymous Reports
                </h3>
                {/* <div className="space-y-5">
                  {dummyHotspots
                    .sort((a, b) => a.id - b.id) // Simple sort for demo
                    .map((report) => (
                      <div
                        key={report.id}
                        className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                      >
                        <div className="flex-shrink-0 mt-1">
                          <AlertTriangle size={20} className="text-yellow-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {report.area}
                          </h4>
                          <p className="text-sm text-gray-500 flex items-center gap-2">
                            <Clock size={14} /> {report.time}
                          </p>
                        </div>
                      </div>
                    ))}
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      <HowItWorks></HowItWorks>

      <section className="py-24 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">
            The Problem of Silence
          </h2>
          {/* Using Tailwind's typography plugin */}
          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              Women and girls face harassment in public spaces every single
              day. Most of these incidents go unreported because they fear
              being judged, it takes too much energy, or they feel "it
              happens to everyone" and stay silent.
            </p>
            <blockquote>
              The problem isn’t just the harassment — it’s the lack of
              visibility.
            </blockquote>
            <p>
              Our solution is a simple, anonymous web platform that allows
              women to report harassment in seconds, automatically mark the
              location on a heatmap, and generate safety scores. This
              allows NGOs and Police to view hotspots and take preventive
              action.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};



export default HomePage;