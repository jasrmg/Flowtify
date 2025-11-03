"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { mapMarkers } from "@/app/lib/mockData";

// Dynamically import map component to avoid SSR issues
const MapContainer = dynamic(() => import("./MapContainer"), {
  ssr: false,
  loading: () => (
    <div className="map-loading">
      <div className="loading-spinner"></div>
      <p>Loading map...</p>
    </div>
  ),
});

export const MapView = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredReports, setFilteredReports] = useState([]);
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Initialize reports with status
  useEffect(() => {
    // Add status to markers based on ID (mock logic)
    const reportsWithStatus = mapMarkers.map((marker) => ({
      ...marker,
      status:
        marker.id <= 2 ? "verified" : marker.id <= 4 ? "pending" : "resolved",
      timestamp: `${marker.id} hour${marker.id > 1 ? "s" : ""} ago`,
    }));
    setFilteredReports(reportsWithStatus);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = mapMarkers.map((marker) => ({
      ...marker,
      status:
        marker.id <= 2 ? "verified" : marker.id <= 4 ? "pending" : "resolved",
      timestamp: `${marker.id} hour${marker.id > 1 ? "s" : ""} ago`,
    }));

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((report) => report.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((report) =>
        report.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReports(filtered);
  }, [statusFilter, searchTerm]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Reset filters
    setStatusFilter("all");
    setSearchTerm("");
    setIsRefreshing(false);
  };

  return (
    <main className="main-content">
      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-title">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
            <line x1="8" y1="2" x2="8" y2="18"></line>
            <line x1="16" y1="6" x2="16" y2="22"></line>
          </svg>
          <h2>Map View</h2>
        </div>

        <div className="filter-controls">
          <div className="filter-dropdown">
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Reports</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <button
            className={`filter-btn ${isRefreshing ? "spinning" : ""}`}
            onClick={handleRefresh}
            title="Refresh Map"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
          </button>

          <button
            className="filter-btn"
            onClick={() => setIsLegendOpen(!isLegendOpen)}
            title="Toggle Legend"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
            </svg>
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="map-container">
        <MapContainer reports={filteredReports} />

        {/* Legend Drawer */}
        <div className={`legend-drawer ${isLegendOpen ? "active" : ""}`}>
          <div className="legend-header">
            <h4>Map Legend</h4>
            <button
              className="legend-close"
              onClick={() => setIsLegendOpen(false)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div className="legend-items">
            <div className="legend-item">
              <span className="legend-marker verified"></span>
              <span className="legend-label">Verified Flood</span>
            </div>
            <div className="legend-item">
              <span className="legend-marker pending"></span>
              <span className="legend-label">Pending Report</span>
            </div>
            <div className="legend-item">
              <span className="legend-marker resolved"></span>
              <span className="legend-label">Resolved</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MapView;
