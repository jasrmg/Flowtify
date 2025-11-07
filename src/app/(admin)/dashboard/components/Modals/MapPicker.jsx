"use client";

import { useEffect, useRef, useState } from "react";

export const MapPicker = ({ onLocationSelect, initialLocation }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const isInitializedRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for next tick to ensure DOM is ready
    const timer = setTimeout(() => {
      // Only initialize once
      if (
        isInitializedRef.current ||
        typeof window === "undefined" ||
        !mapRef.current
      ) {
        return;
      }

      let isCancelled = false;
      isInitializedRef.current = true;

      const initMap = async () => {
        try {
          console.log("Starting map initialization...");
          const L = (await import("leaflet")).default;
          console.log("Leaflet loaded");
          await import("leaflet/dist/leaflet.css");
          console.log("Leaflet CSS loaded");

          if (isCancelled || !mapRef.current) {
            console.log("Initialization cancelled or ref not available");
            return;
          }

          // Fix default marker icon
          delete L.Icon.Default.prototype._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl:
              "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
            iconUrl:
              "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
            shadowUrl:
              "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
          });

          // Default to Cebu City center
          const defaultLat = initialLocation?.lat
            ? parseFloat(initialLocation.lat)
            : 10.3157;
          const defaultLng = initialLocation?.lng
            ? parseFloat(initialLocation.lng)
            : 123.8854;

          console.log("Creating map with container:", mapRef.current);
          const map = L.map(mapRef.current).setView(
            [defaultLat, defaultLng],
            13
          );
          mapInstanceRef.current = map;
          console.log("Map created successfully");

          const tileLayer = L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
              attribution: "© OpenStreetMap contributors",
              maxZoom: 19,
            }
          );

          // Track if tiles have loaded
          let tilesLoaded = false;

          tileLayer.on("load", () => {
            console.log("Tiles loaded");
            tilesLoaded = true;
            setIsLoading(false);
          });

          tileLayer.on("tileerror", (error) => {
            console.log("Tile error:", error);
          });

          tileLayer.addTo(map);

          // Force map to be visible after a short delay regardless of tile loading
          setTimeout(() => {
            console.log("Timeout triggered, tiles loaded:", tilesLoaded);
            setIsLoading(false);
            // Force Leaflet to recalculate map size
            if (map && !isCancelled) {
              map.invalidateSize();
              console.log("Map size invalidated");
            }
          }, 1500);

          // Add marker
          const marker = L.marker([defaultLat, defaultLng], {
            draggable: true,
          }).addTo(map);
          markerRef.current = marker;

          // Helper functions
          const generateSimpleGeohash = (lat, lng) => {
            const base32 = "0123456789bcdefghjkmnpqrstuvwxyz";
            let latMin = -90,
              latMax = 90;
            let lngMin = -180,
              lngMax = 180;
            let geohash = "";
            let isEven = true;
            let bit = 0;
            let ch = 0;
            const precision = 8;

            while (geohash.length < precision) {
              let mid;
              if (isEven) {
                mid = (lngMin + lngMax) / 2;
                if (lng > mid) {
                  ch |= 1 << (4 - bit);
                  lngMin = mid;
                } else {
                  lngMax = mid;
                }
              } else {
                mid = (latMin + latMax) / 2;
                if (lat > mid) {
                  ch |= 1 << (4 - bit);
                  latMin = mid;
                } else {
                  latMax = mid;
                }
              }
              isEven = !isEven;
              if (bit < 4) {
                bit++;
              } else {
                geohash += base32[ch];
                bit = 0;
                ch = 0;
              }
            }
            return geohash;
          };

          const handleLocationChange = async (lat, lng) => {
            try {
              const latitude = typeof lat === "string" ? parseFloat(lat) : lat;
              const longitude = typeof lng === "string" ? parseFloat(lng) : lng;

              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
              );
              const data = await response.json();

              // 🧠 Log the full response for inspection
              console.log("📍 Raw reverse geocode result:", data);
              console.log("📋 display_name:", data.display_name);

              let barangay = "";
              let city = "Cebu City";

              if (data.address) {
                barangay =
                  data.address.suburb ||
                  data.address.neighbourhood ||
                  data.address.quarter ||
                  data.address.hamlet ||
                  data.address.village ||
                  data.address.residential ||
                  "";

                city =
                  data.address.city ||
                  data.address.town ||
                  data.address.municipality ||
                  "Cebu City";

                // fallback from display_name if barangay missing
                if (!barangay && data.display_name) {
                  const parts = data.display_name
                    .split(",")
                    .map((p) => p.trim());
                  // If the first part isn’t the same as city or Cebu, assume it’s the barangay
                  const candidate = parts[0];
                  if (
                    candidate &&
                    candidate.toLowerCase() !== city.toLowerCase() &&
                    !candidate.toLowerCase().includes("cebu")
                  ) {
                    barangay = possibleBarangay;
                  }
                }

                if (!barangay) {
                  barangay = `Unnamed Area, ${city}`;
                }

                barangay =
                  barangay.charAt(0).toUpperCase() +
                  barangay.slice(1).toLowerCase();
              }

              const locationData = {
                lat: latitude.toFixed(6),
                lng: longitude.toFixed(6),
                barangay,
                city,
                geohash: generateSimpleGeohash(latitude, longitude),
              };

              console.log("📍 Final locationData:", locationData); // ✅ This shows what gets passed out
              onLocationSelect(locationData);
            } catch (error) {
              console.error("Geocoding error:", error);
              const latitude = typeof lat === "string" ? parseFloat(lat) : lat;
              const longitude = typeof lng === "string" ? parseFloat(lng) : lng;

              const locationData = {
                lat: latitude.toFixed(6),
                lng: longitude.toFixed(6),
                barangay: "",
                city: "Cebu City",
                geohash: generateSimpleGeohash(latitude, longitude),
              };
              onLocationSelect(locationData);
            }
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

          // Handle marker drag
          marker.on("dragend", () => {
            const position = marker.getLatLng();
            handleLocationChange(position.lat, position.lng);
          });

          // Handle map click
          map.on("click", (e) => {
            marker.setLatLng(e.latlng);
            handleLocationChange(e.latlng.lat, e.latlng.lng);
          });

          // Get initial location details
          handleLocationChange(defaultLat, defaultLng);

          // Try to get user's location (async, doesn't block loading)
          if (navigator.geolocation && !initialLocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                if (!mapInstanceRef.current || !markerRef.current) return;

                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                const distance = getDistance(
                  userLat,
                  userLng,
                  10.3157,
                  123.8854
                );

                // Only use user location if within 100km of Cebu
                if (distance < 100) {
                  map.setView([userLat, userLng], 15);
                  marker.setLatLng([userLat, userLng]);
                  handleLocationChange(userLat, userLng);
                }
              },
              (error) => console.log("Geolocation error:", error.message)
            );
          }
        } catch (error) {
          console.error("Map initialization error:", error);
          setIsLoading(false);
        }
      };

      initMap();

      return () => {
        isCancelled = true;
      };
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.log("Cleanup error:", e);
        }
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once

  return (
    <div className="map-picker">
      <div className="map-picker-container" ref={mapRef}>
        {isLoading && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1000,
              background: "var(--bg-primary)",
              color: "var(--primary)",
              padding: "12px 24px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <svg
              style={{
                width: "16px",
                height: "16px",
                animation: "spin 1s linear infinite",
              }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
            Loading map...
          </div>
        )}
      </div>
      <p className="map-picker-hint">
        Click or drag the marker to select the flood location
      </p>
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
