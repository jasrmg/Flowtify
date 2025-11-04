"use client";

import dynamic from "next/dynamic";

import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import "./map.css";
import "@/app/components/Modals/modals.css";

// Dynamically import with SSR disabled
const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <main className="main-content">
      <div className="map-container">
        <div className="map-loading">
          <div className="loading-spinner"></div>
          <p>Loading map...</p>
        </div>
      </div>
    </main>
  ),
});

// This is the component that was in your page.jsx
export const MapPage = () => {
  return (
    <main className="main-content">
      <MapView />
    </main>
  );
};

// Export it as the default
export default MapPage;
