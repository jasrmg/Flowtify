"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

import { StatCard } from "@/app/(admin)/dashboard/components/StatCard/StatCard";
import { HotlinesGrid } from "@/app/(admin)/dashboard/components/HotLinesGrid/HotlinesGrid";
import { SystemLogs } from "@/app/(admin)/dashboard/components/SystemLogs/SystemLogs";
import { MonthlyChart } from "@/app/(admin)/dashboard/components/Chart/MonthlyChart";
import { AlertsGrid } from "@/app/(admin)/dashboard/components/AlertsGrid/AlertsGrid";
import { FloodMapWrapper } from "@/app/(admin)/dashboard/components/Map/FloodMapWrapper";
import { MapDescModal } from "@/app/(admin)/dashboard/components/Modals/MapDescModal";
import { ReportsTable } from "@/app/(admin)/dashboard/components/ReportsTable/ReportsTable";
import { ReportDetailsModal } from "@/app/(admin)/dashboard/components/Modals/ReportDetailsModal";
import { CreateReportModal } from "@/app/(admin)/dashboard/components/Modals/CreateReportModal";
import { RejectionModal } from "@/app/(admin)/dashboard/components/Modals/RejectionModal";
import { AlertModal } from "@/app/(admin)/dashboard/components/Modals/AlertModal";
import { HotlineModal } from "@/app/(admin)/dashboard/components/Modals/HotlineModal";
import { Toast } from "@/components/Toast/Toast";
import { ResolveConfirmModal } from "@/app/(admin)/dashboard/components/Modals/ResolveConfirmModal";

import { useAlerts } from "@/hooks/useAlerts";
import { useEmergencyHotlines } from "@/hooks/useEmergencyHotlines";
import { useStatistics } from "@/hooks/useStatistics";
import { useMonthlyReports } from "@/hooks/useMonthlyReports";
import { useSystemLogs } from "@/hooks/useSystemLogs";
import { useToast } from "@/hooks/useToast";
import { useReports } from "@/hooks/useReports";
import { useMapReports } from "@/hooks/useMapReports";
import { useSearch } from "@/hooks/useSearch";

import "@/app/(admin)/dashboard/components/Modals/modals.css";
import "./dashboard.css";
import "@/app/(admin)/dashboard/search-highlight.css";

export default function DashboardPage() {
  // CUSTOM HOOKS
  const { currentUser } = useAuth();
  const {
    alerts,
    loading: alertsLoading,
    createAlert,
    deactivateAlert,
  } = useAlerts(true);

  const {
    hotlines,
    loading: hotlinesLoading,
    createHotline,
    updateHotline,
    deactivateHotline,
  } = useEmergencyHotlines(true);

  const { logs: systemLogs, loading: logsLoading } = useSystemLogs(50);

  const { stats: statsData, loading: statsLoading } = useStatistics();

  const { monthlyData, loading: chartLoading } = useMonthlyReports();

  const {
    reports,
    loading: reportsLoading,
    approveReport,
    rejectReport,
  } = useReports("pending");

  const {
    reports: verifiedReports,
    loading: verifiedLoading,
    resolveReport,
  } = useReports("verified");

  const { toast, showSuccess, showError, hideToast } = useToast();
  const { markers: mapMarkers, loading: mapLoading } =
    useMapReports("pendingAndVerified");
  console.log("map markers: ", mapMarkers);

  const { highlightText, clearHighlights } = useSearch();
  // END OF CUSTOM HOOKS

  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [reportToReject, setReportToReject] = useState(null);
  const [isReportDetailsModalOpen, setIsReportDetailsModalOpen] =
    useState(false);
  const [isCreateReportModalOpen, setIsCreateReportModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isReportProcessing, setIsReportProcessing] = useState(false);

  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isAlertSubmitting, setIsAlertSubmitting] = useState(false);

  const [isHotlineModalOpen, setIsHotlineModalOpen] = useState(false);
  const [isHotlineSubmitting, setIsHotlineSubmitting] = useState(false);
  const [selectedHotline, setSelectedHotline] = useState(null);

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isMapDescModalOpen, setIsMapDescModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [reportToResolve, setReportToResolve] = useState(null);
  const [isResolveProcessing, setIsResolveProcessing] = useState(false);

  // EVENT HANDLERS
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
    // Search in both pending and verified reports
    let report = reports.find((r) => r.id === reportId);

    if (!report) {
      report = verifiedReports.find((r) => r.id === reportId);
    }

    if (report) {
      setSelectedReport(report);
      setIsReportDetailsModalOpen(true);
    }
  };

  const handleCloseReportDetailsModal = () => {
    setIsReportDetailsModalOpen(false);
    setSelectedReport(null);
  };

  const handleCloseCreateReportModal = () => {
    setIsCreateReportModalOpen(false);
  };

  const handleApproveReport = async (reportId) => {
    setIsReportProcessing(true);
    const result = await approveReport(reportId, currentUser.uid, "admin");
    setIsReportProcessing(false);

    if (result.success) {
      showSuccess("Report approved successfully!");
      setIsReportDetailsModalOpen(false);
      setSelectedReport(null);
    } else {
      showError(`Failed to approve report: ${result.error}`);
    }
  };

  // open reject modal
  const handleRejectReport = async (reportId) => {
    setReportToReject(reportId);
    setIsRejectionModalOpen(true);
  };

  const handleConfirmReject = async (reason) => {
    console.log("Rejection reason from modal:", reason);
    if (!reportToReject) return;

    setIsReportProcessing(true);
    const result = await rejectReport(
      reportToReject,
      currentUser.uid,
      "admin",
      reason
    );
    setIsReportProcessing(false);

    if (result.success) {
      showSuccess("Report rejected successfully!");
      setIsRejectionModalOpen(false);
      setIsReportDetailsModalOpen(false);
      setSelectedReport(null);
      setReportToReject(null);
    } else {
      showError(`Failed to reject report: ${result.error}`);
    }
  };

  const handleCloseRejectionModal = () => {
    if (!isReportProcessing) {
      setIsRejectionModalOpen(false);
      setReportToReject(null);
    }
  };

  const handleAddAlert = async (alertData) => {
    setIsAlertSubmitting(true);
    const result = await createAlert(alertData, currentUser.uid, "admin");
    setIsAlertSubmitting(false);

    if (result.success) {
      setIsAlertModalOpen(false);
      showSuccess("Alert created successfully!");
    } else {
      showError(`Failed to create alert: ${result.error}`);
    }
  };

  const handleDeactivateAlert = async (alertId) => {
    const result = await deactivateAlert(alertId, currentUser.uid, "admin");
    if (result.success) {
      showSuccess("Alert deactivated successfully!");
    } else {
      showError(`Failed to deactivate alert: ${result.error}`);
    }
  };

  const handleAddHotline = async (hotlineData, hotlineId) => {
    setIsHotlineSubmitting(true);

    let result;
    if (hotlineId) {
      // Edit mode
      result = await updateHotline(
        hotlineId,
        hotlineData,
        currentUser.uid,
        "admin"
      );
    } else {
      // Add mode
      result = await createHotline(hotlineData, currentUser.uid, "admin");
    }

    setIsHotlineSubmitting(false);

    if (result.success) {
      setIsHotlineModalOpen(false);
      setSelectedHotline(null);
      showSuccess(
        hotlineId
          ? "Hotline updated successfully!"
          : "Hotline added successfully!"
      );
    } else {
      showError(
        `Failed to ${hotlineId ? "update" : "add"} hotline: ${result.error}`
      );
    }
  };

  const handleEditHotline = (hotline) => {
    setSelectedHotline(hotline);
    setIsHotlineModalOpen(true);
  };

  const handleDeactivateHotline = async (hotlineId) => {
    const result = await deactivateHotline(hotlineId, currentUser.uid, "admin");
    if (result.success) {
      showSuccess("Hotline deleted successfully!");
    } else {
      showError(`Failed to delete hotline: ${result.error}`);
    }
  };

  const handleCloseHotlineModal = () => {
    setIsHotlineModalOpen(false);
    setSelectedHotline(null);
  };

  const handleResolveReport = (reportId) => {
    console.log("Resolve button clicked, reportId:", reportId);
    setReportToResolve(reportId);
    setIsResolveModalOpen(true);

    console.log("Modal should open, isResolveModalOpen:", true);
  };

  const handleConfirmResolve = async () => {
    console.log("handleConfirmResolve called!");
    console.log("reportToResolve:", reportToResolve);

    if (!reportToResolve) {
      console.log("No report to resolve!");
      return;
    }

    setIsResolveProcessing(true);
    console.log("Calling resolveReport...");

    const result = await resolveReport(
      reportToResolve,
      currentUser.uid,
      "admin"
    );

    console.log("Resolve result:", result);
    setIsResolveProcessing(false);

    if (result.success) {
      showSuccess("Report marked as resolved!");
      setIsResolveModalOpen(false);
      setIsReportDetailsModalOpen(false);
      setSelectedReport(null);
      setReportToResolve(null);
    } else {
      showError(`Failed to resolve report: ${result.error}`);
    }
  };

  const handleCloseResolveModal = () => {
    if (!isResolveProcessing) {
      setIsResolveModalOpen(false);
      setReportToResolve(null);
    }
  };

  const handleSearch = useCallback(
    (searchTerm, moveToNext = false) => {
      if (!searchTerm || searchTerm.trim() === "") {
        clearHighlights();
        return;
      }

      const { count, currentIndex } = highlightText(searchTerm, moveToNext);

      if (count === 0) {
        showError("No results found");
      } else if (moveToNext) {
        showSuccess(`Result ${currentIndex} of ${count}`);
      } else {
        showSuccess(`Found ${count} match${count !== 1 ? "es" : ""}`);
      }
    },
    [highlightText, clearHighlights, showError, showSuccess]
  );
  // END OF EVENT HANDLERS

  useEffect(() => {
    const handleSearchEvent = (e) => {
      handleSearch(e.detail.searchTerm, e.detail.moveToNext || false);
    };

    window.addEventListener("dashboardSearch", handleSearchEvent);

    return () => {
      window.removeEventListener("dashboardSearch", handleSearchEvent);
      clearHighlights();
    };
  }, [handleSearch, clearHighlights]);

  return (
    <>
      {/* Page Header */}
      <div className="content-header">
        <div className="content-header-text">
          <h1>Admin Dashboard</h1>
          <p>Overview and system management</p>
        </div>
        <button
          className="report-btn"
          onClick={() => setIsCreateReportModalOpen(true)}
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

      {/* Map Section */}
      <section className="content-section" id="mapSection">
        <div className="section-header">
          <h2>Flood Reports Map</h2>
          <p>Interactive view of reported flood locations</p>
        </div>

        {mapLoading ? (
          <div
            style={{
              height: "600px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "var(--bg-secondary)",
              borderRadius: "16px",
              color: "var(--text-secondary)",
            }}
          >
            <svg
              style={{
                width: "48px",
                height: "48px",
                animation: "spin 1s linear infinite",
                marginBottom: "1rem",
              }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
            <p>Loading map data...</p>
          </div>
        ) : mapMarkers.length === 0 ? (
          <div
            style={{
              height: "600px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "var(--bg-secondary)",
              borderRadius: "16px",
              color: "var(--text-secondary)",
              textAlign: "center",
              padding: "2rem",
            }}
          >
            <svg
              style={{
                width: "64px",
                height: "64px",
                marginBottom: "1rem",
                opacity: 0.5,
              }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
            <p
              style={{
                fontSize: "1.1rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              No flood reports to display
            </p>
            <span style={{ fontSize: "0.9rem" }}>
              Pending and verified reports will appear on the map
            </span>
          </div>
        ) : (
          <FloodMapWrapper
            markers={mapMarkers}
            onViewDescription={handleViewDescription}
          />
        )}
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
            loading={reportsLoading}
            onViewDetails={handleViewReportDetails}
          />
        </div>
      </section>

      {/* Verified Reports Section */}
      <section className="content-section" id="verifiedReportsSection">
        <div className="section-header">
          <h2>Verified / Unresolved Reports</h2>
          <p>Manage verified flood reports awaiting resolution</p>
        </div>

        <div className="table-container">
          <ReportsTable
            reports={verifiedReports}
            loading={verifiedLoading}
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

        <AlertsGrid
          alerts={alerts}
          loading={alertsLoading}
          onDeactivate={handleDeactivateAlert}
        />
      </section>

      {/* Emergency Hotlines Section */}
      <section className="content-section" id="hotlinesSection">
        <div className="section-header">
          <h2>Emergency Hotlines</h2>
          <button
            className="create-btn"
            onClick={() => {
              setSelectedHotline(null);
              setIsHotlineModalOpen(true);
            }}
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

        <HotlinesGrid
          hotlines={hotlines}
          loading={hotlinesLoading}
          onEdit={handleEditHotline}
          onDeactivate={handleDeactivateHotline}
        />
      </section>

      {/* Statistics Section */}
      <section className="content-section" id="statisticsSection">
        <div className="section-header">
          <h2>Statistics Overview</h2>
          <p>Visual summary of system data</p>
        </div>

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
              loading={statsLoading}
            />
          ))}
        </div>

        <MonthlyChart data={monthlyData} loading={chartLoading} />
      </section>

      {/* System Logs Section */}
      <section className="content-section" id="logsSection">
        <div className="section-header">
          <h2>System Logs</h2>
          <p>Recent admin actions and system events</p>
        </div>

        <SystemLogs logs={systemLogs} loading={logsLoading} />
      </section>

      {/* Map Description Modal */}
      <MapDescModal
        isOpen={isMapDescModalOpen}
        onClose={handleCloseMapDescModal}
        marker={selectedMarker}
      />

      {/* Report Details Modal */}
      <ReportDetailsModal
        isOpen={isReportDetailsModalOpen}
        onClose={handleCloseReportDetailsModal}
        report={selectedReport}
        onApprove={handleApproveReport}
        onReject={handleRejectReport}
        onResolve={handleResolveReport}
        isProcessing={isReportProcessing}
      />
      {/* Create Report Modal */}
      <CreateReportModal
        isOpen={isCreateReportModalOpen}
        onClose={handleCloseCreateReportModal}
        onSuccess={showSuccess}
        onError={showError}
        currentUser={currentUser}
      />
      {/* Rejection Modal */}
      <RejectionModal
        isOpen={isRejectionModalOpen}
        onClose={handleCloseRejectionModal}
        onConfirm={handleConfirmReject}
        isProcessing={isReportProcessing}
      />

      {/* Alert Modal */}
      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        onSubmit={handleAddAlert}
        isSubmitting={isAlertSubmitting}
        showSuccess={showSuccess}
        showError={showError}
      />

      {/* Hotline Modal */}
      <HotlineModal
        isOpen={isHotlineModalOpen}
        onClose={handleCloseHotlineModal}
        onSubmit={handleAddHotline}
        isSubmitting={isHotlineSubmitting}
        hotline={selectedHotline}
        showSuccess={showSuccess}
        showError={showError}
      />

      {/* Toast Notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      {/* Resolve Confirmation Modal */}
      <ResolveConfirmModal
        isOpen={isResolveModalOpen}
        onClose={handleCloseResolveModal}
        onConfirm={handleConfirmResolve}
        isProcessing={isResolveProcessing}
      />
    </>
  );
}
