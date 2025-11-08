"use client";

export const ResolveConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal active">
      <div className="modal-overlay" onClick={onClose}></div>
      <div
        className="modal-content modal-confirm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Resolve Flood Report</h2>
          <button
            className="modal-close"
            onClick={onClose}
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
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <p
            style={{
              marginBottom: "1rem",
              fontSize: "1rem",
              lineHeight: "1.6",
            }}
          >
            Are you sure you want to mark this flood report as{" "}
            <strong>resolved</strong>?
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            This action cannot be undone. The report will be moved to resolved
            status.
          </p>
        </div>

        <div className="modal-footer">
          <button
            className="modal-btn cancel-btn"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            className="modal-btn submit-btn"
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="spinner"></div>
                Resolving...
              </>
            ) : (
              "Yes, Resolve"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
