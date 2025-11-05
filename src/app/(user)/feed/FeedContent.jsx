"use client";
import { useState } from "react";
import { floodReportsWithCoordinates } from "@/app/lib/mockData";
import { ReportCard } from "../components/ReportCard/ReportCard";
import { RightSidebar } from "../components/RightSidebar/RightSidebar";
import { ReportModal } from "./components/ReportModal";
import { ReportDetailsModal } from "./components/ReportDetailsModal";
import "./feed.css";

export function FeedContent() {
  const [filteredReports] = useState(floodReportsWithCoordinates);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const handleReportClick = (report) => {
    setSelectedReport(report);
  };

  const handleCloseDetails = () => {
    setSelectedReport(null);
  };

  return (
    <>
      <main className="main-content">
        <div className="content-header">
          <div className="content-header-text">
            <h1>Flood Reports</h1>
            <p>Real-time flood monitoring across Cebu City</p>
          </div>
          <button
            className="report-btn"
            onClick={() => setIsReportModalOpen(true)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
            </svg>
            Report Flooding
          </button>
        </div>

        <div className="reports-grid" id="reportsGrid">
          {filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onClick={handleReportClick}
            />
          ))}
        </div>
      </main>

      <RightSidebar />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      <ReportDetailsModal
        report={selectedReport}
        isOpen={!!selectedReport}
        onClose={handleCloseDetails}
      />
    </>
  );
}
