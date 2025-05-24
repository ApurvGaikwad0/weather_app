"use client";

import WeatherDashboard from "@/components/weather-dashboard"
import React, { useState } from 'react';
import GoogleMap from '../components/GoogleMap';

export default function Home() {
  const [location, setLocation] = useState('');
  const [showMap, setShowMap] = useState(false);

  const handleSearch = () => {
    setShowMap(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600 dark:text-blue-400">Weather Explorer</h1>
        <WeatherDashboard />
        <div>
          <h1>Weather App with Google Maps</h1>
          <input
            type="text"
            placeholder="Enter a location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <button onClick={handleSearch}>Show Map</button>
          {showMap && <GoogleMap location={location} />}
        </div>
      </div>
    </main>
  )
}