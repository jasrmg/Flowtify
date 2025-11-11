"use client";

import { useState } from "react";
import { useMapReports } from "@/hooks/useMapReports";
import FilterBar from "./components/FilterBar";
import Legend from "./components/Legend";
import LoadingSpinner from "./components/LoadingSpinner";
import MapContainer from "./components/MapContainer";

export const MapView = () => {
  // Use "all" to fetch all reports, then filter client-side
  const { markers: reports, loading: isLoading } = useMapReports("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [legendOpen, setLegendOpen] = useState(false);

  const handleRefresh = () => {
    // With real-time Firestore listener, data automatically updates
    // Just reset the filter to show fresh view
    setStatusFilter("all");
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
        <MapContainer reports={reports} statusFilter={statusFilter} />

        <Legend isOpen={legendOpen} onClose={() => setLegendOpen(false)} />

        <LoadingSpinner isVisible={isLoading} />
      </div>
    </>
  );
};

export default MapView;
