"use client";

import { useState } from "react";
import { ConfirmModal } from "@/app/components/Modals/ConfirmModal";
import { formatAlertTime } from "@/utils/alertHelpers";
import "./AlertsGrid.css";

export const AlertsGrid = ({ alerts, onDeactivate, loading }) => {
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeactivateClick = (alert, e) => {
    e.stopPropagation();
    setSelectedAlert(alert);
    setIsConfirmOpen(true);
  };

  const handleConfirmDeactivate = async () => {
    if (!selectedAlert) return;

    setIsProcessing(true);
    await onDeactivate(selectedAlert.id);
    setIsProcessing(false);
    setIsConfirmOpen(false);
    setSelectedAlert(null);
  };

  const handleCloseConfirm = () => {
    if (!isProcessing) {
      setIsConfirmOpen(false);
      setSelectedAlert(null);
    }
  };

  if (loading) {
    return (
      <div className="alerts-loading">
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
        <p>Loading alerts...</p>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="alerts-empty">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 16v-4"></path>
          <path d="M12 8h.01"></path>
        </svg>
        <p>No active alerts</p>
        <span>All systems normal</span>
      </div>
    );
  }

  return (
    <>
      <div className="alerts-grid" id="alertsGrid">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`alert-card severity-${alert.severity}`}
          >
            <button
              className="alert-deactivate-btn"
              onClick={(e) => handleDeactivateClick(alert, e)}
              title="Deactivate alert"
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
            <div className="alert-header">
              <span className={`severity-badge severity-${alert.severity}`}>
                {alert.severity.charAt(0).toUpperCase() +
                  alert.severity.slice(1)}
              </span>
            </div>
            <h3 className="alert-title">{alert.title}</h3>
            <div className="alert-location">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              {alert.location}
            </div>
            <p className="alert-message">{alert.message}</p>
            <div className="alert-time">{formatAlertTime(alert.timestamp)}</div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmDeactivate}
        title="Deactivate Alert"
        message="Are you sure you want to deactivate this alert? This action cannot be undone and the alert will no longer be visible to users."
        isProcessing={isProcessing}
      />
    </>
  );
};
