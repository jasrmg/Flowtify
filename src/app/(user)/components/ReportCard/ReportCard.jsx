"use client";
import "./ReportCard.css";

export const ReportCard = ({ report }) => {
  const statusClass = `status-${report.status}`;
  const statusText =
    report.status.charAt(0).toUpperCase() + report.status.slice(1);

  return (
    <article className="report-card">
      <div className="report-image">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
        </svg>
      </div>
      <div className="report-content">
        <div className="report-header">
          <span className={`report-status ${statusClass}`}>{statusText}</span>
        </div>
        <p className="report-description">{report.description}</p>
        <div className="report-meta">
          <div className="meta-item">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>{report.location}</span>
          </div>
          <div className="meta-item">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>{report.timestamp}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ReportCard;
