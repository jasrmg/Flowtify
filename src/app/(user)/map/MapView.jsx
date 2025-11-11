"use client";

import { useState, useEffect } from "react";

import { useMapReports } from "@/hooks/useMapReports";
import { useToast } from "@/hooks/useToast";

import FilterBar from "./components/FilterBar";
import Legend from "./components/Legend";
import LoadingSpinner from "./components/LoadingSpinner";
import MapContainer from "./components/MapContainer";

import { Toast } from "@/components/Toast/Toast";

export const MapView = () => {
  const { markers: reports, loading: isLoading } = useMapReports("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [legendOpen, setLegendOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast, showToast, hideToast } = useToast();

  // Listen for search events from Navbar
  useEffect(() => {
    const handleSearch = (event) => {
      const term = event.detail?.searchTerm || "";
      setSearchTerm(term);

      // Check if search returns results
      if (term.trim() !== "") {
        const searchLower = term.toLowerCase().trim();
        const matchingReports = reports.filter((report) => {
          const city = (report.city || "").toLowerCase();
          const brg = (report.brg || "").toLowerCase();
          const location = (report.location || "").toLowerCase();

          return (
            city.includes(searchLower) ||
            brg.includes(searchLower) ||
            location.includes(searchLower)
          );
        });

        if (matchingReports.length === 0) {
          showToast(`No reports found for "${term}"`, "info");
        }
      }
    };

    // Listen for the custom search event
    window.addEventListener("mapSearch", handleSearch);

    return () => {
      window.removeEventListener("mapSearch", handleSearch);
    };
  }, [reports, showToast]);

  const handleRefresh = () => {
    setStatusFilter("all");
    setSearchTerm("");
  };

  return (
    <>
      <FilterBar
        statusFilter={statusFilter}
        onFilterChange={setStatusFilter}
        onRefresh={handleRefresh}
        onToggleLegend={() => setLegendOpen(!legendOpen)}
      />

      <div className="map-container">
        <MapContainer
          reports={reports}
          statusFilter={statusFilter}
          searchTerm={searchTerm}
        />
        <Legend isOpen={legendOpen} onClose={() => setLegendOpen(false)} />
        <LoadingSpinner isVisible={isLoading} />
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </>
  );
};

export default MapView;
