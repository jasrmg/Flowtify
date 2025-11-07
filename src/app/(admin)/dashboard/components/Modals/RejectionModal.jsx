"use client";

import { useState } from "react";
import "./modals.css"; // Adjust path if needed

export const RejectionModal = ({
  isOpen,
  onClose,
  onConfirm,
  isProcessing = false,
}) => {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    onConfirm(reason);
    setReason(""); // Reset for next time
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal active">
      <div className="modal-overlay" onClick={handleClose}></div>
      <div className="modal-content modal-confirm">
        <div className="modal-header">
          <h2>Reject Report</h2>
          <button
            className="modal-close"
            onClick={handleClose}
            disabled={isProcessing}
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

        <div className="modal-body">
          <div className="confirm-icon">
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
          </div>

          <p style={{ marginBottom: "1.5rem" }}>
            Please provide a reason for rejecting this report. This will help
            the user understand why their report was not approved.
          </p>

          <div className="form-group">
            <label htmlFor="rejection-reason">
              Rejection Reason (Optional)
            </label>
            <textarea
              id="rejection-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Insufficient evidence, Duplicate report, Outside jurisdiction..."
              disabled={isProcessing}
              style={{ minHeight: "120px" }}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="modal-btn cancel-btn"
            onClick={handleClose}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            className="modal-btn danger-btn"
            onClick={handleSubmit}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="spinner"></div>
                Rejecting...
              </>
            ) : (
              <>
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
                Reject Report
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
