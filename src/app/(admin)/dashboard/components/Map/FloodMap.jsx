"use client";
import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./FloodMap.css";

export const FloodMap = ({ markers = [], onViewDescription }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    // helper function to initialize the map
    const initializeMap = (lat, lng, zoom) => {
      // check to only initialize it once, this prevents race condition caused by react strict mode
      if (mapInstanceRef.current) return;
      // initialize map
      const map = L.map(mapRef.current).setView([lat, lng], zoom);
      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapInstanceRef.current = map;

      // Initialize markers layer group
      markersLayerRef.current = L.layerGroup().addTo(map);

      setIsMapReady(true);
    };

    // geolocation logic
    const defaultLat = 10.3157;
    const defaultLng = 123.8854;
    const defaultZoom = 13;

    // Check if geolocation is available
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // success: the user allowed the location
          const { latitude, longitude } = position.coords;
          initializeMap(latitude, longitude, defaultZoom);
        },
        (error) => {
          // error: user denied
          initializeMap(defaultLat, defaultLng, defaultZoom);
        }
      );
    } else {
      // geolocation not supported by the browser:
      initializeMap(defaultLat, defaultLng, defaultZoom);
    }

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
    if (!isMapReady || !mapInstanceRef.current || !markersLayerRef.current)
      return;

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
          ${
            marker.photo &&
            (Array.isArray(marker.photo) ? marker.photo[0] : marker.photo)
              ? `
            <div class="popup-image-container">
              <img src="${
                Array.isArray(marker.photo) ? marker.photo[0] : marker.photo
              }" alt="${marker.location}" class="popup-photo" />
            </div>
          `
              : `
            <div class="popup-image-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <p>No Photo Available</p>
            </div>
          `
          }
          <div class="popup-content">
            <div class="popup-header">
              <div class="popup-location">${marker.location}</div>
            </div>
            <p class="popup-description">${marker.description}</p>
            <button 
              class="popup-button" 
              onclick="window.handleViewDescription('${marker.id}')"
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
  }, [markers, onViewDescription, isMapReady]);

  return (
    <div className="map-container">
      <div ref={mapRef} id="map" style={{ height: "600px", width: "100%" }} />
    </div>
  );
};
