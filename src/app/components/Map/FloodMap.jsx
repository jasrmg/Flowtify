"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./FloodMap.css";

export const FloodMap = ({ markers = [], onViewDescription }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  useEffect(() => {
    // Only initialize once
    if (mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([10.3157, 123.8854], 13);

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    mapInstanceRef.current = map;

    // Initialize markers layer group
    markersLayerRef.current = L.layerGroup().addTo(map);

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when they change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    // Clear existing markers
    markersLayerRef.current.clearLayers();

    // Add new markers
    markers.forEach((marker) => {
      const circle = L.circle([marker.lat, marker.lng], {
        color: "#ff6b6b",
        fillColor: "#ff6b6b",
        fillOpacity: 0.5,
        radius: 300,
      });

      // Create popup content with updated styling
      const popupContent = `
        <div class="popup-container">
          <div class="popup-image">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
            </svg>
          </div>
          <div class="popup-content">
            <div class="popup-header">
              <div class="popup-location">${marker.location}</div>
            </div>
            <p class="popup-description">${marker.description}</p>
            <button 
              class="popup-button" 
              onclick="window.handleViewDescription(${marker.id})"
            >
              View Full Description
            </button>
          </div>
        </div>
      `;

      circle.bindPopup(popupContent, {
        maxWidth: 280,
        className: "custom-popup",
      });

      circle.addTo(markersLayerRef.current);
    });

    // Make onViewDescription available globally for popup buttons
    if (typeof window !== "undefined") {
      window.handleViewDescription = onViewDescription;
    }
  }, [markers, onViewDescription]);

  return (
    <div className="map-container">
      <div ref={mapRef} id="map" style={{ height: "600px", width: "100%" }} />
    </div>
  );
};
