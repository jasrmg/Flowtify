"use client";

export const Legend = ({ isOpen, onClose }) => {
  return (
    <div className={`legend-drawer ${isOpen ? "active" : ""}`}>
      <div className="legend-header">
        <h4>Map Legend</h4>
        <button className="legend-close" onClick={onClose}>
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
  );
};

export default Legend;
