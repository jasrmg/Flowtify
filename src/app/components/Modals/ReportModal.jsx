"use client";

export const ReportModal = ({
  isOpen,
  onClose,
  report,
  onApprove,
  onReject,
}) => {
  if (!isOpen || !report) return null;

  const handleApprove = () => {
    onApprove(report.id);
    onClose();
  };

  const handleReject = () => {
    onReject(report.id);
    onClose();
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
          <div className="modal-field">
            <label>Reporter</label>
            <p>{report.reporter}</p>
          </div>
          <div className="modal-field">
            <label>Location</label>
            <p>{report.location}</p>
          </div>
          <div className="modal-field">
            <label>Description</label>
            <p>{report.description}</p>
          </div>
          <div className="modal-field">
            <label>Date Reported</label>
            <p>{report.date}</p>
          </div>
          <div className="modal-field">
            <label>Photo</label>
            <div className="photo-preview">
              <img src={report.photo} alt="Flood report photo" />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-btn reject-btn" onClick={handleReject}>
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
            Reject
          </button>
          <button className="modal-btn approve-btn" onClick={handleApprove}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};
