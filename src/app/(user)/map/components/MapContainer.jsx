"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MapDescModal } from "./MapDescModal";

export const MapContainer = ({ reports, statusFilter }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerClusterGroupRef = useRef(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize map on mount
  useEffect(() => {
    // Prevent running on the server
    if (typeof window === "undefined") return;

    let isCancelled = false; // Flag to prevent setup on unmount

    const initMap = async () => {
      // Dynamically import Leaflet
      const L = (await import("leaflet")).default;

      // Import CSS
      await import("leaflet/dist/leaflet.css");
      await import("leaflet.markercluster");
      await import("leaflet.markercluster/dist/MarkerCluster.css");
      await import("leaflet.markercluster/dist/MarkerCluster.Default.css");

      // If component unmounted while awaiting imports, stop
      if (isCancelled || !mapRef.current) return;

      // Fix default marker icon paths
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      // Create map instance ONLY if it doesn't already exist
      // This is the final safeguard against the error
      let map;
      if (mapRef.current._leaflet_id) {
        // If map is already initialized, just get the instance
        map = mapRef.current._map;
      } else {
        // Otherwise, create a new one
        map = L.map(mapRef.current).setView([10.3157, 123.8854], 13);
      }

      map.attributionControl.setPrefix(false);

      mapInstanceRef.current = map;

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      // Initialize marker cluster group
      const markerClusterGroup = L.markerClusterGroup({
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
      });

      map.addLayer(markerClusterGroup);

      // Store references
      markerClusterGroupRef.current = markerClusterGroup;
      setIsMapReady(true);

      // Try to get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Check if map still exists before acting
            if (!mapInstanceRef.current) return;

            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            const distance = getDistance(userLat, userLng, 10.3157, 123.8854);

            if (distance < 50) {
              map.setView([userLat, userLng], 13);

              L.marker([userLat, userLng], {
                icon: L.divIcon({
                  className: "user-location-marker",
                  html: '<div style="background-color: #3FA9F5; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
                  iconSize: [16, 16],
                }),
              })
                .addTo(map) // 👈 This is where the bad line was
                .bindPopup("Your Location");
            }
          },
          (error) => console.log("Geolocation error:", error.message)
        );
      }
    };

    initMap();

    // Cleanup
    return () => {
      isCancelled = true; // Tell initMap to stop if it's still running
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  const getMarkerColor = (status) => {
    switch (status) {
      case "verified":
        return "#d14343";
      case "pending":
        return "#f59e0b";
      case "resolved":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const createPopupContent = (report) => {
    const status = report.status || "unknown";
    const location = report.location || "Unknown location";
    const description = report.description || "No description provided.";
    const timestamp = report.timestamp || "Invalid time";

    const statusClass = status;
    const statusText = status.charAt(0).toUpperCase() + status.slice(1);

    // Get first photo if photo is an array, otherwise use photo directly
    const photoUrl = Array.isArray(report.photo)
      ? report.photo[0]
      : report.photo;

    // Create image or placeholder HTML
    const imageHtml = photoUrl
      ? `<img src="${photoUrl}" alt="${location}" class="popup-photo">`
      : `
      <div class="popup-image-placeholder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
        </svg>
      </div>`;

    return `
    <div class="popup-container">
      <div class="popup-image-container">
        ${imageHtml}
      </div>
      <div class="popup-content">
        <div class="popup-header">
          <div class="popup-location">${location}</div>
          <span class="popup-status ${statusClass}">${statusText}</span>
        </div>
        <p class="popup-description">${description}</p>
        <div class="popup-time">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          ${timestamp}
        </div>
        <button class="popup-button" onclick="window.handleViewDescription(${report.id})">
          View Full Description
        </button>
      </div>
    </div>
    `;
  };

  const updateMarkers = useCallback(
    async (reportsData) => {
      const L = (await import("leaflet")).default;

      await import("leaflet.markercluster");

      const markerClusterGroup = markerClusterGroupRef.current;

      // Clear existing markers
      markerClusterGroup.clearLayers();

      // Filter reports based on status
      const filteredReports =
        statusFilter === "all"
          ? reportsData
          : reportsData.filter((report) => report.status === statusFilter);

      // Create markers for each report
      filteredReports.forEach((report) => {
        const markerColor = getMarkerColor(report.status);

        const customIcon = L.divIcon({
          className: "custom-marker",
          html: `<div style="background-color: ${markerColor}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([report.lat, report.lng], { icon: customIcon });

        const popupContent = createPopupContent(report);
        marker.bindPopup(popupContent, {
          maxWidth: 280,
          className: "custom-popup",
        });

        markerClusterGroup.addLayer(marker);
      });

      // Fit bounds if there are markers
      if (filteredReports.length > 0) {
        const bounds = L.latLngBounds(
          filteredReports.map((r) => [r.lat, r.lng])
        );
        mapInstanceRef.current.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 15,
        });
      }
    },
    [statusFilter]
  );

  // Update markers when reports or filter changes
  useEffect(() => {
    if (
      !isMapReady ||
      !mapInstanceRef.current ||
      !markerClusterGroupRef.current
    )
      return;

    updateMarkers(reports);
  }, [reports, statusFilter, isMapReady, updateMarkers]);

  useEffect(() => {
    // Make the handler available globally for the popup buttons
    window.handleViewDescription = (reportId) => {
      const report = reports.find((r) => r.id === reportId);
      if (report) {
        setSelectedReport(report);
        setIsModalOpen(true);
      }
    };

    return () => {
      delete window.handleViewDescription;
    };
  }, [reports]);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <>
      <div ref={mapRef} id="map" style={{ height: "100%", width: "100%" }} />
      <MapDescModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        report={selectedReport}
      />
    </>
  );
};

export default MapContainer;
