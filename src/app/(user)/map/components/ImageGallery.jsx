"use client";

import { useState } from "react";

export const ImageGallery = ({ images, alt, onImageClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Ensure images is an array
  const imageArray = Array.isArray(images) ? images : [images];

  if (!imageArray || imageArray.length === 0) return null;

  const goToPrevious = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? imageArray.length - 1 : prev - 1));
  };

  const goToNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === imageArray.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index, e) => {
    e.stopPropagation();
    setCurrentIndex(index);
  };

  return (
    <div className="image-gallery">
      <div
        className="gallery-image-container"
        onClick={() => onImageClick(currentIndex)}
      >
        <img
          src={imageArray[currentIndex]}
          alt={`${alt} - ${currentIndex + 1}`}
          className="gallery-image"
        />

        {/* Navigation Arrows - Only show if more than 1 image */}
        {imageArray.length > 1 && (
          <>
            {/* Left Arrow - Only show if not on first image */}
            {currentIndex > 0 && (
              <button
                className="gallery-arrow gallery-arrow-left"
                onClick={goToPrevious}
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
            )}

            {/* Right Arrow - Only show if not on last image */}
            {currentIndex < imageArray.length - 1 && (
              <button
                className="gallery-arrow gallery-arrow-right"
                onClick={goToNext}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            )}
          </>
        )}

        {/* Click hint overlay */}
        <div className="gallery-click-hint">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </div>
      </div>

      {/* Dots Navigation - Only show if more than 1 image */}
      {imageArray.length > 1 && (
        <div className="gallery-dots">
          {imageArray.map((_, index) => (
            <button
              key={index}
              className={`gallery-dot ${
                index === currentIndex ? "active" : ""
              }`}
              onClick={(e) => goToSlide(index, e)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
