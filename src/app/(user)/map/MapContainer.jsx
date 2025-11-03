"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet.markercluster";

// Fix for default marker icons in Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export const MapContainer = ({ reports }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerClusterRef = useRef(null);

  // Initialize map
  useEffect(() => {
    if (typeof window === "undefined" || mapInstanceRef.current) return;

    const defaultCenter = [10.3157, 123.8854]; // Cebu City
    const defaultZoom = 13;

    // Create map
    const mapInstance = L.map(mapRef.current).setView(
      defaultCenter,
      defaultZoom
    );

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapInstance);

    // Initialize marker cluster group
    const markerCluster = L.markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
    });

    mapInstance.addLayer(markerCluster);

    mapInstanceRef.current = mapInstance;
    markerClusterRef.current = markerCluster;

    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          const distance = getDistance(userLat, userLng, 10.3157, 123.8854);

          if (distance < 50) {
            mapInstance.setView([userLat, userLng], defaultZoom);

            L.marker([userLat, userLng], {
              icon: L.divIcon({
                className: "user-location-marker",
                html: '<div style="background-color: #3FA9F5; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
                iconSize: [16, 16],
              }),
            })
              .addTo(mapInstance)
              .bindPopup("Your Location");
          }
        },
        (error) => {
          console.log("Geolocation error:", error.message);
        }
      );
    }

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when reports change
  useEffect(() => {
    if (!markerClusterRef.current) return;

    // Clear existing markers
    markerClusterRef.current.clearLayers();

    // Add new markers
    reports.forEach((report) => {
      const marker = createMarker(report);
      markerClusterRef.current.addLayer(marker);
    });

    // Fit bounds if there are reports
    if (reports.length > 0 && mapInstanceRef.current) {
      const bounds = L.latLngBounds(reports.map((r) => [r.lat, r.lng]));
      mapInstanceRef.current.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15,
      });
    }
  }, [reports]);

  const createMarker = (report) => {
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

    return marker;
  };

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
    const statusClass = report.status;
    const statusText =
      report.status.charAt(0).toUpperCase() + report.status.slice(1);

    return `
      <div class="popup-container">
        <div class="popup-image">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
          </svg>
        </div>
        <div class="popup-content">
          <div class="popup-header">
            <div class="popup-location">${report.location}</div>
            <span class="popup-status ${statusClass}">${statusText}</span>
          </div>
          <p class="popup-description">${report.description}</p>
          <div class="popup-time">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            ${report.timestamp}
          </div>
          <button class="popup-button" onclick="alert('View full report for #${report.id}')">
            View Full Report
          </button>
        </div>
      </div>
    `;
  };

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
    <div ref={mapRef} id="map" style={{ width: "100%", height: "100%" }} />
  );
};

export default MapContainer;
