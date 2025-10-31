"use client";

import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./FloodMap.css";

export const FloodMap = ({ markers, onViewDescription }) => {
  const centerPosition = [10.3157, 123.8854]; // Cebu City center

  return (
    <div className="map-wrapper">
      <MapContainer
        center={centerPosition}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((marker) => (
          <Circle
            key={marker.id}
            center={[marker.lat, marker.lng]}
            pathOptions={{
              color: "#ff6b6b",
              fillColor: "#ff6b6b",
              fillOpacity: 0.5,
            }}
            radius={300}
          >
            <Popup>
              <div className="map-popup-content">
                <h3>{marker.location}</h3>
                <p>{marker.description}</p>
                <button
                  className="map-popup-btn"
                  onClick={() => onViewDescription(marker.id)}
                >
                  View Full Description
                </button>
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
};
