"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

import { ImageGallery } from "../ImageGallery/ImageGallery";
import { ImageLightbox } from "../ImageLightBox/ImageLightbox";

export const MapDescModal = ({ isOpen, onClose, marker }) => {
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
          {marker.photo && (
            <div className="modal-field">
              <ImageGallery
                images={marker.photo}
                alt={marker.location}
                onImageClick={(index) => {
                  setLightboxStartIndex(index);
                  setLightboxOpen(true);
                }}
              />
            </div>
          )}

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
      {/* Image Lightbox */}
      {lightboxOpen && (
        <ImageLightbox
          images={marker.photo}
          initialIndex={lightboxStartIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
};
