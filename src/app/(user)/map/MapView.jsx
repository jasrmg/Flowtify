"use client";

import { useState, useEffect, useCallback } from "react";
import { floodReportsWithCoordinates } from "@/app/lib/mockData";
import FilterBar from "./components/FilterBar";
import Legend from "./components/Legend";
import LoadingSpinner from "./components/LoadingSpinner";
import MapContainer from "./components/MapContainer";

export const MapView = () => {
  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [legendOpen, setLegendOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadFloodReports = useCallback(async () => {
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In production: const response = await fetch('/api/flood-reports');
    // For now, use mock data
    setReports(floodReportsWithCoordinates);
    setIsLoading(false);
  }, []);

  // Load flood reports on mount
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (mounted) {
        await loadFloodReports();
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [loadFloodReports]);

  const handleRefresh = async () => {
    await loadFloodReports();
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
