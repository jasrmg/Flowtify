"use client";

import { useState } from "react";
import Image from "next/image";
import "./ImageGallery.css";

export const ImageGallery = ({ images, alt, onImageClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Convert single image to array
  const imageArray = Array.isArray(images) ? images : [images];

  const handlePrevious = (e) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (currentIndex < imageArray.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleDotClick = (e, index) => {
    e.stopPropagation();
    setCurrentIndex(index);
  };

  const handleCenterClick = () => {
    if (onImageClick) {
      onImageClick(currentIndex);
    }
  };

  return (
    <div className="image-gallery">
      <div className="image-gallery-container" onClick={handleCenterClick}>
        <Image
          src={imageArray[currentIndex]}
          alt={alt || `Image ${currentIndex + 1}`}
          width={800}
          height={600}
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "8px",
            objectFit: "cover",
            maxHeight: "400px",
          }}
        />

        {/* Navigation Arrows - Only show if multiple images */}
        {imageArray.length > 1 && (
          <>
            {currentIndex > 0 && (
              <button
                className="gallery-arrow gallery-arrow-left"
                onClick={handlePrevious}
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

            {currentIndex < imageArray.length - 1 && (
              <button
                className="gallery-arrow gallery-arrow-right"
                onClick={handleNext}
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

        {/* Center Click Hint */}
        <div className="gallery-fullscreen-hint">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 3 21 3 21 9"></polyline>
            <polyline points="9 21 3 21 3 15"></polyline>
            <line x1="21" y1="3" x2="14" y2="10"></line>
            <line x1="3" y1="21" x2="10" y2="14"></line>
          </svg>
        </div>
      </div>

      {/* Pagination Dots - Only show if multiple images */}
      {imageArray.length > 1 && (
        <div className="gallery-dots">
          {imageArray.map((_, index) => (
            <button
              key={index}
              className={`gallery-dot ${
                index === currentIndex ? "active" : ""
              }`}
              onClick={(e) => handleDotClick(e, index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
