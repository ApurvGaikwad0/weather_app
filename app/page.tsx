"use client";

import WeatherDashboard from "@/components/weather-dashboard";
import React, { useState } from 'react';
import GoogleMap from '../components/GoogleMap';
import YouTubeVideos from '../components/YouTubeVideos';
import WikipediaSummary from '../components/WikipediaSummary';
import { fetchYouTubeVideos } from '../lib/youtube';
import { fetchWikipediaSummary } from '../lib/wikipedia';
import {
  exportAsJSON,
  exportAsXML,
  exportAsCSV,
  exportAsMarkdown,
} from '../lib/exportData';

export default function Home() {
  const [location, setLocation] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [wikipediaSummary, setWikipediaSummary] = useState<any>(null);

  const handleSearch = async () => {
    setShowMap(true);

    try {
      // Fetch YouTube videos for the entered location
      const fetchedVideos = await fetchYouTubeVideos(location);
      setVideos(fetchedVideos);

      // Fetch Wikipedia summary for the entered location
      const fetchedSummary = await fetchWikipediaSummary(location);
      setWikipediaSummary(fetchedSummary);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleExport = (format: string) => {
    const dataToExport = {
      location,
      videos,
      wikipediaSummary,
    };

    switch (format) {
      case 'json':
        exportAsJSON(dataToExport, location || 'data');
        break;
      case 'xml':
        exportAsXML(dataToExport, location || 'data');
        break;
      case 'csv':
        exportAsCSV(videos, location || 'data'); // Export videos as CSV
        break;
      case 'markdown':
        exportAsMarkdown(dataToExport, location || 'data');
        break;
      default:
        console.error('Unsupported format');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600 dark:text-blue-400">Weather Explorer</h1>
        <WeatherDashboard />
        <div>
          <input
            type="text"
            placeholder="Enter a location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          />
          <button
            onClick={handleSearch}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Search
          </button>
          {showMap && <GoogleMap location={location} />}
          {wikipediaSummary && (
            <div className="mt-8">
              <WikipediaSummary summary={wikipediaSummary} />
            </div>
          )}
          {videos.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-blue-600 dark:text-blue-400">YouTube Videos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <YouTubeVideos videos={videos} />
              </div>
            </div>
          )}
          {(videos.length > 0 || wikipediaSummary) && (
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => handleExport('json')}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                Export as JSON
              </button>
              <button
                onClick={() => handleExport('xml')}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Export as XML
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700"
              >
                Export as CSV
              </button>
              <button
                onClick={() => handleExport('markdown')}
                className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
              >
                Export as Markdown
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

