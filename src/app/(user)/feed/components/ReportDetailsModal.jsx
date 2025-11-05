"use client";
import { useState } from "react";
import "./ReportDetailsModal.css";

export const ReportDetailsModal = ({ report, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !report) return null;

  const statusClass = `status-${report.status}`;
  const statusText =
    report.status.charAt(0).toUpperCase() + report.status.slice(1);

  // Handle photo array or single photo
  const photos = report.photo
    ? Array.isArray(report.photo)
      ? report.photo
      : [report.photo]
    : [];

  const hasMultiplePhotos = photos.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % photos.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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

        <div className="modal-body">
          {/* Image Gallery Section */}
          <div className="modal-image-section">
            {photos.length > 0 ? (
              <div className="image-gallery">
                <img
                  src={photos[currentImageIndex]}
                  alt={`Flood report at ${report.location}`}
                  className="modal-image"
                />
                {hasMultiplePhotos && (
                  <>
                    <button
                      className="gallery-nav prev"
                      onClick={previousImage}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                    </button>
                    <button className="gallery-nav next" onClick={nextImage}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                    <div className="gallery-indicator">
                      {currentImageIndex + 1} / {photos.length}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="modal-placeholder">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                </svg>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="modal-details">
            <div className="modal-header">
              <span className={`report-status ${statusClass}`}>
                {statusText}
              </span>
            </div>

            <h2 className="modal-location">{report.location}</h2>

            <div className="modal-meta">
              <div className="meta-item">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>{report.timestamp}</span>
              </div>
              <div className="meta-item">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Reported by {report.reporter}</span>
              </div>
            </div>

            <div className="modal-description">
              <h3>Description</h3>
              <p>{report.fullDescription || report.description}</p>
            </div>

            {report.date && (
              <div className="modal-date">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>{report.date}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
