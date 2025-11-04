"use client";

import { useState, useEffect, useRef } from "react";

import { ImageGallery } from "./ImageGallery";
import { ImageLightbox } from "./ImageLightbox";

export const MapDescModal = ({ isOpen, onClose, report }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxStartIndex, setLightboxStartIndex] = useState(0);

  const scrollPosition = useRef(0);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      scrollPosition.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPosition.current}px`;
      document.body.style.width = "100%";
      document.body.classList.add("modal-open");
    } else if (scrollPosition.current !== 0) {
      const savedPosition = scrollPosition.current;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.classList.remove("modal-open");

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

  // Get first photo if photo is an array, otherwise use photo directly
  const photoUrl = Array.isArray(report.photo) ? report.photo[0] : report.photo;

  return (
    <div className="modal active">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{report.location}</h2>
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
          {report.photo && (
            <div className="modal-field">
              <ImageGallery
                images={report.photo}
                alt={report.location}
                onImageClick={(index) => {
                  setLightboxStartIndex(index);
                  setLightboxOpen(true);
                }}
              />
            </div>
          )}

          <div className="modal-field">
            <label>Location</label>
            <p>{report.location}</p>
          </div>

          <div className="modal-field">
            <label>Description</label>
            <p>{report.description}</p>
          </div>

          <div className="modal-field">
            <label>Status</label>
            <p style={{ textTransform: "capitalize" }}>{report.status}</p>
          </div>

          <div className="modal-field">
            <label>Reported</label>
            <p>{report.timestamp}</p>
          </div>
        </div>
      </div>
      {/* Image Lightbox */}
      {lightboxOpen && (
        <ImageLightbox
          images={report.photo}
          initialIndex={lightboxStartIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
};
