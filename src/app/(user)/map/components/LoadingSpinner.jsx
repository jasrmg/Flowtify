"use client";

export const LoadingSpinner = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="map-loading">
      <div className="loading-spinner"></div>
      <p>Loading flood reports...</p>
    </div>
  );
};

export default LoadingSpinner;
