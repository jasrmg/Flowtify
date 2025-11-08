"use client";

import { useState, useEffect, useRef } from "react";
import { ImageLightbox } from "../ImageLightBox/ImageLightbox";
import { ImageGallery } from "../ImageGallery/ImageGallery";

import {
  formatReportDate,
  formatLocation,
  getSeverityClass,
  getStatusClass,
  formatStatus,
} from "@/utils/reportHelpers";

export const ReportDetailsModal = ({
  isOpen,
  onClose,
  report,
  onApprove,
  onReject,
  onResolve,
  isProcessing = false,
}) => {
  const scrollPosition = useRef(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxStartIndex, setLightboxStartIndex] = useState(0);

  // dont allow scroll if the modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      scrollPosition.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPosition.current}px`;
      document.body.style.width = "100%";
      document.body.classList.add("modal-open");
    } else if (scrollPosition.current !== 0) {
      // Restore scroll position
      const savedPosition = scrollPosition.current;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.classList.remove("modal-open");

      // Use requestAnimationFrame to ensure styles are applied before scrolling
      requestAnimationFrame(() => {
        window.scrollTo({
          top: savedPosition,
          behavior: "instant",
        });
      });
    }

    return () => {
      if (document.body.classList.contains("modal-open")) {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.classList.remove("modal-open");
      }
    };
  }, [isOpen]);

  if (!isOpen || !report) return null;

  const handleApprove = () => {
    onApprove(report.id);
    onClose();
  };

  const handleReject = () => {
    onReject(report.id);
  };

  return (
    <div className="modal active">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Report #{report.id}</h2>
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
          <div className="report-status-bar">
            <span className={`status-badge ${getStatusClass(report.status)}`}>
              {formatStatus(report.status)}
            </span>
            <span
              className={`severity-badge ${getSeverityClass(report.severity)}`}
            >
              {report.severity || "low"} severity
            </span>
          </div>

          <div className="modal-field">
            <label>Location</label>
            <div className="location-display">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <div>
                <p>{formatLocation(report.location)}</p>
                {report.location?.lat && report.location?.lng && (
                  <small>
                    Coordinates: {report.location.lat.toFixed(4)},{" "}
                    {report.location.lng.toFixed(4)}
                  </small>
                )}
              </div>
            </div>
          </div>

          <div className="modal-field">
            <label>Description</label>
            <p>{report.description}</p>
          </div>

          <div className="modal-field">
            <label>Date Reported</label>
            <p>{formatReportDate(report.createdAt)}</p>
          </div>

          {report.photoUrl && report.photoUrl.length > 0 && (
            <div className="modal-field">
              <label>Photos ({report.photoUrl.length})</label>
              <ImageGallery
                images={report.photoUrl}
                alt="Flood report photo"
                onImageClick={(index) => {
                  setLightboxStartIndex(index);
                  setLightboxOpen(true);
                }}
              />
            </div>
          )}

          {report.verifiedAt && (
            <div className="modal-field">
              <label>Verified At</label>
              <p>{formatReportDate(report.verifiedAt)}</p>
            </div>
          )}
        </div>
        <div className="modal-footer">
          {report.status === "pending" && (
            <>
              <button
                className="modal-btn reject-btn"
                onClick={handleReject}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="spinner"></div>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                )}
                {isProcessing ? "Processing..." : "Reject"}
              </button>
              <button
                className="modal-btn approve-btn"
                onClick={handleApprove}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="spinner"></div>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                )}
                {isProcessing ? "Processing..." : "Approve"}
              </button>
            </>
          )}

          {report.status === "verified" && onResolve && (
            <button
              className="modal-btn approve-btn"
              onClick={() => onResolve(report.id)}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="spinner"></div>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              )}
              {isProcessing ? "Processing..." : "Mark as Resolved"}
            </button>
          )}

          {(report.status === "rejected" || report.status === "resolved") && (
            <button className="modal-btn modal-btn-secondary" onClick={onClose}>
              Close
            </button>
          )}
        </div>

        {/* Image Lightbox */}
        {lightboxOpen && report.photoUrl && (
          <ImageLightbox
            images={report.photoUrl}
            initialIndex={lightboxStartIndex}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </div>
    </div>
  );
};
