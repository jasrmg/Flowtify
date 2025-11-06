"use client";

import { useState } from "react";
import { ConfirmModal } from "@/app/components/Modals/ConfirmModal";
import "./HotlinesGrid.css";

export const HotlinesGrid = ({ hotlines, onEdit, onDeactivate, loading }) => {
  const [selectedHotline, setSelectedHotline] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEditClick = (hotline, e) => {
    e.stopPropagation();
    onEdit(hotline);
  };

  const handleDeactivateClick = (hotline, e) => {
    e.stopPropagation();
    setSelectedHotline(hotline);
    setIsConfirmOpen(true);
  };

  const handleConfirmDeactivate = async () => {
    if (!selectedHotline) return;

    setIsProcessing(true);
    await onDeactivate(selectedHotline.id);
    setIsProcessing(false);
    setIsConfirmOpen(false);
    setSelectedHotline(null);
  };

  const handleCloseConfirm = () => {
    if (!isProcessing) {
      setIsConfirmOpen(false);
      setSelectedHotline(null);
    }
  };

  if (loading) {
    return (
      <div className="hotlines-loading">
        <svg
          style={{
            width: "48px",
            height: "48px",
            animation: "spin 1s linear infinite",
          }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
        </svg>
        <p>Loading hotlines...</p>
      </div>
    );
  }

  if (hotlines.length === 0) {
    return (
      <div className="hotlines-empty">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
        <p>No emergency hotlines</p>
        <span>Add your first hotline to get started</span>
      </div>
    );
  }

  return (
    <>
      <div className="hotlines-grid" id="hotlinesGrid">
        {hotlines.map((hotline) => (
          <div key={hotline.id} className="hotline-card">
            <div className="hotline-actions">
              <button
                className="hotline-action-btn edit-btn"
                onClick={(e) => handleEditClick(hotline, e)}
                title="Edit hotline"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button
                className="hotline-action-btn delete-btn"
                onClick={(e) => handleDeactivateClick(hotline, e)}
                title="Delete hotline"
              >
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
            <div className="hotline-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <h3 className="hotline-name">{hotline.agencyName}</h3>
            <div className="hotline-number">{hotline.contactNumber}</div>
            <p className="hotline-description">{hotline.description}</p>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmDeactivate}
        title="Delete Emergency Hotline"
        message={`Are you sure you want to delete "${selectedHotline?.agencyName}"? This action cannot be undone and the hotline will no longer be visible to users.`}
        isProcessing={isProcessing}
      />
    </>
  );
};

export default HotlinesGrid;
