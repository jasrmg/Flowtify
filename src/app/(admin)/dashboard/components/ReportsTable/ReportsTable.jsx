"use client";

import "./ReportsTable.css";

export const ReportsTable = ({ reports, onViewDetails }) => {
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Reporter</th>
            <th>Location</th>
            <th>Description</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td>{report.reporter}</td>
              <td>{report.location}</td>
              <td>{report.description.substring(0, 50)}...</td>
              <td>{report.date}</td>
              <td>
                <button
                  className="action-btn"
                  onClick={() => onViewDetails(report.id)}
                >
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
