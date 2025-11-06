"use client";

import {
  formatReportDate,
  formatLocation,
  truncateText,
  getSeverityClass,
} from "@/utils/reportHelpers";

import "./ReportsTable.css";

export const ReportsTable = ({ reports, onViewDetails, loading }) => {
  if (loading) {
    return (
      <div className="table-container">
        <div className="table-loading">
          <div className="loading-spinner"></div>
          <p>Loading reports...</p>
        </div>
      </div>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <div className="table-container">
        <div className="table-empty">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="12" y1="18" x2="12" y2="12"></line>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
          <p>No pending reports</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Location</th>
            <th>Severity</th>
            <th>Description</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td>
                <div className="location-cell">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {formatLocation(report.location)}
                </div>
              </td>
              <td>
                <span
                  className={`severity-badge ${getSeverityClass(
                    report.severity
                  )}`}
                >
                  {report.severity || "low"}
                </span>
              </td>
              <td className="description-cell">
                {truncateText(report.description, 60)}
              </td>
              <td className="date-cell">
                {formatReportDate(report.createdAt)}
              </td>
              <td>
                <button
                  className="action-btn"
                  onClick={() => onViewDetails(report.id)}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
