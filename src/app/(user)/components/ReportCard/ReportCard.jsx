"use client";
import Image from "next/image";
import "./ReportCard.css";

export const ReportCard = ({ report, onClick, isMobile = false }) => {
  const statusClass = `status-${report.status}`;
  const statusText =
    report.status.charAt(0).toUpperCase() + report.status.slice(1);

  // Get the first photo from photoUrl array
  const getReportImage = () => {
    if (!report.photoUrl) return null;
    return Array.isArray(report.photoUrl) && report.photoUrl.length > 0
      ? report.photoUrl[0]
      : null;
  };

  const reportImage = getReportImage();

  // Format location from Firestore structure
  const formatLocation = () => {
    if (typeof report.location === "object" && report.location !== null) {
      if (report.location.brg && report.location.city) {
        return `${report.location.brg}, ${report.location.city}`;
      }
      return "Unknown location";
    }
    return report.location || "Unknown location";
  };

  // Format distance
  const formatDistance = () => {
    if (report.distance !== undefined) {
      if (report.distance < 1) {
        return `${(report.distance * 1000).toFixed(0)}m away`;
      }
      return `${report.distance.toFixed(1)}km away`;
    }
    return null;
  };

  // Truncate description based on device
  const truncateDescription = (text, isMobile) => {
    if (!text) return "";

    const maxLength = isMobile ? 100 : 150;

    if (text.length <= maxLength) {
      return text;
    }

    // Truncate at the character limit
    let truncated = text.substring(0, maxLength);

    // Find the last space to avoid splitting words
    const lastSpace = truncated.lastIndexOf(" ");

    if (lastSpace > 0) {
      truncated = truncated.substring(0, lastSpace);
    }

    return truncated + "…";
  };

  // Format timestamp from Firestore
  const formatTimestamp = () => {
    if (report.createdAt?.toDate) {
      const date = report.createdAt.toDate();
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    }
    return report.timestamp || "Unknown time";
  };

  return (
    <article className="report-card" onClick={() => onClick(report)}>
      <div className="report-image">
        {reportImage ? (
          <img
            src={reportImage}
            alt={`Flood report at ${report.location}`}
            className="report-photo"
          />
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
          </svg>
        )}
      </div>
      <div className="report-content">
        <div className="report-header">
          <span className={`report-status ${statusClass}`}>{statusText}</span>
        </div>
        <p
          className="report-description"
          title={
            report.description?.length > (isMobile ? 100 : 150)
              ? report.description
              : undefined
          }
        >
          {truncateDescription(report.description, isMobile)}
        </p>
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
            <span>{formatLocation()}</span>
          </div>
          {formatDistance() && (
            <div className="meta-item">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              </svg>
              <span>{formatDistance()}</span>
            </div>
          )}
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
            <span>{formatTimestamp()}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ReportCard;
