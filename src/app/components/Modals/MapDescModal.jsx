"use client";

export const MapDescModal = ({ isOpen, onClose, marker }) => {
  if (!isOpen || !marker) return null;

  return (
    <div className="modal active">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{marker.location}</h2>
          <button className="modal-close" onClick={onClose}>
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
        <div className="modal-body">
          <div className="modal-field">
            <label>Location</label>
            <p>{marker.location}</p>
          </div>
          <div className="modal-field">
            <label>Full Description</label>
            <p>{marker.fullDescription}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
