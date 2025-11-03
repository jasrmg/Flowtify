"use client";
import { useState } from "react";
import { floodReports } from "@/app/lib/mockData";
import { ReportCard } from "../components/ReportCard/ReportCard";
import { RightSidebar } from "../components/RightSidebar/RightSidebar";
import "./feed.css";

export function FeedContent() {
  const [filteredReports] = useState(floodReports);

  return (
    <>
      <main className="main-content">
        <div className="content-header">
          <h1>Flood Reports</h1>
          <p>Real-time flood monitoring across Cebu City</p>
        </div>

        <div className="reports-grid" id="reportsGrid">
          {filteredReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      </main>

      <RightSidebar />
    </>
  );
}
