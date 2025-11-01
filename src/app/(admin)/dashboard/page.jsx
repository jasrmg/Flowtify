"use client";

import { useState } from "react";

import { StatCard } from "@/app/components/StatCard/StatCard";
import { HotlinesGrid } from "@/app/components/HotLinesGrid/HotlinesGrid";
import { SystemLogs } from "@/app/components/SystemLogs/SystemLogs";
import { MonthlyChart } from "@/app/components/Chart/MonthlyChart";
import { AlertsGrid } from "@/app/components/AlertsGrid/AlertsGrid";
import { FloodMapWrapper } from "@/app/components/Map/FloodMapWrapper";
import { MapDescModal } from "@/app/components/Modals/MapDescModal";
import { ReportsTable } from "@/app/components/ReportsTable/ReportsTable";
import { ReportModal } from "@/app/components/Modals/ReportModal";
import { AlertModal } from "@/app/components/Modals/AlertModal";
import { HotlineModal } from "@/app/components/Modals/HotlineModal";

import "@/app/components/Modals/modals.css";

import {
  statsData,
  activeAlerts,
  emergencyHotlines,
  systemLogs,
  monthlyReportData,
  mapMarkers,
  pendingReports,
} from "@/app/lib/mockData";

import "./dashboard.css";

export default function DashboardPage() {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isMapDescModalOpen, setIsMapDescModalOpen] = useState(false);
  const [reports, setReports] = useState(pendingReports);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [alerts, setAlerts] = useState(activeAlerts);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const [hotlines, setHotlines] = useState(emergencyHotlines);
  const [isHotlineModalOpen, setIsHotlineModalOpen] = useState(false);

  const handleViewDescription = (markerId) => {
    const marker = mapMarkers.find((m) => m.id === markerId);
    if (marker) {
      setSelectedMarker(marker);
      setIsMapDescModalOpen(true);
    }
  };

  const handleCloseMapDescModal = () => {
    setIsMapDescModalOpen(false);
    setSelectedMarker(null);
  };

  const handleViewReportDetails = (reportId) => {
    const report = reports.find((r) => r.id === reportId);
    if (report) {
      setSelectedReport(report);
      setIsReportModalOpen(true);
    }
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
    setSelectedReport(null);
  };

  const handleApproveReport = (reportId) => {
    alert(`Report #${reportId} approved!`);
    // Remove from pending reports
    setReports((prev) => prev.filter((r) => r.id !== reportId));
  };

  const handleRejectReport = (reportId) => {
    alert(`Report #${reportId} rejected!`);
    // Remove from pending reports
    setReports((prev) => prev.filter((r) => r.id !== reportId));
  };

  const handleAddAlert = (alertData) => {
    const newAlert = {
      id: alerts.length + 1,
      title: alertData.title,
      location: alertData.location,
      severity: alertData.severity,
      time: "Active now",
    };
    setAlerts((prev) => [newAlert, ...prev]);
    alert("Alert created successfully!");
  };

  const handleAddHotline = (hotlineData) => {
    const newHotline = {
      id: hotlines.length + 1,
      name: hotlineData.name,
      number: hotlineData.number,
      description: hotlineData.description,
    };
    setHotlines((prev) => [newHotline, ...prev]);
    alert("Emergency hotline added successfully!");
  };

  return (
    <>
      {/* Page Header */}
      <div className="content-header">
        <h1>Admin Dashboard</h1>
        <p>Overview and system management</p>
      </div>

      {/* Map Section */}
      <section className="content-section" id="mapSection">
        <div className="section-header">
          <h2>Flood Reports Map</h2>
          <p>Interactive view of reported flood locations</p>
        </div>

        <FloodMapWrapper
          markers={mapMarkers}
          onViewDescription={handleViewDescription}
        />
      </section>

      {/* Reports Section */}
      <section className="content-section" id="reportsSection">
        <div className="section-header">
          <h2>Pending Reports</h2>
          <p>Review and manage flood reports</p>
        </div>

        <div className="table-container">
          <ReportsTable
            reports={reports}
            onViewDetails={handleViewReportDetails}
          />
        </div>
      </section>

      {/* Alerts Section */}
      <section className="content-section" id="alertsSection">
        <div className="section-header">
          <h2>Active Flood Alerts</h2>
          <button
            className="create-btn"
            onClick={() => setIsAlertModalOpen(true)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Alert
          </button>
        </div>

        <AlertsGrid alerts={activeAlerts} />
      </section>

      {/* Emergency Hotlines Section */}
      <section className="content-section" id="hotlinesSection">
        <div className="section-header">
          <h2>Emergency Hotlines</h2>
          <button
            className="create-btn"
            onClick={() => setIsHotlineModalOpen(true)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Hotline
          </button>
        </div>

        <HotlinesGrid hotlines={emergencyHotlines} />
      </section>

      {/* Statistics Section */}
      <section className="content-section" id="statisticsSection">
        <div className="section-header">
          <h2>Statistics Overview</h2>
          <p>Visual summary of system data</p>
        </div>

        <div className="stats-grid">
          <div className="stats-grid">
            {statsData.map((stat) => (
              <StatCard
                key={stat.id}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                changeType={stat.changeType}
                period={stat.period}
                icon={stat.icon}
                iconType={stat.iconType}
              />
            ))}
          </div>
        </div>

        <MonthlyChart data={monthlyReportData} />
      </section>

      {/* System Logs Section */}
      <section className="content-section" id="logsSection">
        <div className="section-header">
          <h2>System Logs</h2>
          <p>Recent admin actions and system events</p>
        </div>

        <SystemLogs logs={systemLogs} />
      </section>

      {/* Map Description Modal */}
      <MapDescModal
        isOpen={isMapDescModalOpen}
        onClose={handleCloseMapDescModal}
        marker={selectedMarker}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={handleCloseReportModal}
        report={selectedReport}
        onApprove={handleApproveReport}
        onReject={handleRejectReport}
      />

      {/* Alert Modal */}
      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        onSubmit={handleAddAlert}
      />

      {/* Hotline Modal */}
      <HotlineModal
        isOpen={isHotlineModalOpen}
        onClose={() => setIsHotlineModalOpen(false)}
        onSubmit={handleAddHotline}
      />
    </>
  );
}
