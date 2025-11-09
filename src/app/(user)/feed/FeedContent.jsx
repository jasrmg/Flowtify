"use client";
import { useState, useEffect } from "react";

import { useAuth } from "@/contexts/AuthContext";

import { useFeedReports } from "@/hooks/useFeedReports";
import { useIsMobile } from "@/hooks/useIsMobile";

import { ReportCard } from "../components/ReportCard/ReportCard";
import { floodReportsWithCoordinates } from "@/app/lib/mockData"; // kuhaonon
import { RightSidebar } from "../components/RightSidebar/RightSidebar";
import { ReportModal } from "./components/ReportModal";
import { ReportDetailsModal } from "./components/ReportDetailsModal";

import "./feed.css";

export function FeedContent() {
  // contexts
  const { currentUser } = useAuth();
  // hooks
  const isMobile = useIsMobile();
  //states
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [filteredReports] = useState(floodReportsWithCoordinates); // kuhaonon
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const pageSize = isMobile ? 8 : 10;
  const { reports, loading, isFetchingMore, error, hasMore, loadMore } =
    useFeedReports(userLocation, pageSize);

  // side effects:
  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      // Check if user is near bottom of page
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      // Trigger when 200px from bottom
      if (
        scrollHeight - scrollTop - clientHeight < 200 &&
        hasMore &&
        !loading &&
        !isFetchingMore
      ) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, isFetchingMore, loadMore]);

  // Get user's location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location obtained:", position.coords);
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationError(null);
        },
        (error) => {
          console.error("Geolocation error code:", error.code);
          console.error("Geolocation error message:", error.message);

          let errorMessage =
            "Unable to get your location. Showing reports near Cebu City.";

          switch (error.code) {
            case 1: // PERMISSION_DENIED
              errorMessage =
                "Location access denied. Showing reports near Cebu City.";
              break;
            case 2: // POSITION_UNAVAILABLE
              errorMessage =
                "Location unavailable. Showing reports near Cebu City.";
              break;
            case 3: // TIMEOUT
              errorMessage =
                "Location request timed out. Showing reports near Cebu City.";
              break;
          }
          setLocationError(errorMessage);
          // Fallback to Cebu City coordinates
          setUserLocation({
            lat: 10.3157,
            lng: 123.8854,
          });
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000, // Allow cached position up to 5 minutes old
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
      // Fallback to Cebu City coordinates
      setUserLocation({
        lat: 10.3157,
        lng: 123.8854,
      });
    }
  }, []);

  // handlers
  const handleReportClick = (report) => {
    setSelectedReport(report);
  };

  const handleCloseDetails = () => {
    setSelectedReport(null);
  };

  return (
    <>
      <main className="main-content main-content--user">
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
          {locationError && (
            <div className="location-warning">
              <p>{locationError}</p>
            </div>
          )}

          {loading && reports.length === 0 ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="no-reports">
              <p>No flood reports found in your area.</p>
            </div>
          ) : (
            <>
              {reports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onClick={handleReportClick}
                  isMobile={isMobile}
                />
              ))}

              {isFetchingMore && (
                <div className="loading-more">
                  <div className="spinner"></div>
                  <p>Loading more reports...</p>
                </div>
              )}

              {!hasMore && reports.length > 0 && (
                <div className="end-of-feed">
                  <p>Yo&apos;ve reached the end</p>
                </div>
              )}
            </>
          )}
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
