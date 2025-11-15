"use client";
import { useState, useEffect } from "react";

import { useAuth } from "@/contexts/AuthContext";

import { useFeedReports } from "@/hooks/useFeedReports";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useToast } from "@/hooks/useToast";
import { Toast } from "@/components/Toast/Toast";

import { ReportCard } from "../components/ReportCard/ReportCard";
import { RightSidebar } from "../components/RightSidebar/RightSidebar";
import { ReportModal } from "./components/ReportModal";
import { ReportDetailsModal } from "./components/ReportDetailsModal";

import "./feed.css";

export function FeedContent() {
  // contexts
  const { currentUser } = useAuth();
  // hooks
  const isMobile = useIsMobile();
  const { toast, showToast, hideToast, showWarning, showInfo } = useToast();
  //states
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [locationPermissionAsked, setLocationPermissionAsked] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const pageSize = isMobile ? 8 : 10;
  const { reports, loading, isFetchingMore, error, hasMore, loadMore } =
    useFeedReports(userLocation, pageSize, searchTerm);

  // side effects:
  // Listen for search events from Navbar
  useEffect(() => {
    const handleMapSearch = (event) => {
      const { searchTerm: term } = event.detail;
      setSearchTerm(term);
    };

    window.addEventListener("mapSearch", handleMapSearch);
    return () => window.removeEventListener("mapSearch", handleMapSearch);
  }, []);

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      // Check if user is near bottom of page
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      // Trigger when 200px from bottom
      // Only load more if: has more reports, not currently loading, and actually have reports
      if (
        scrollHeight - scrollTop - clientHeight < 200 &&
        hasMore &&
        !loading &&
        !isFetchingMore &&
        reports.length > 0
      ) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, isFetchingMore, loadMore, reports.length]);
  // Get user's location on mount
  useEffect(() => {
    if (!locationPermissionAsked) {
      if (navigator.geolocation) {
        // Browser will automatically prompt for permission
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log("Location obtained:", position.coords);
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setLocationPermissionAsked(true);
          },
          (error) => {
            console.error("Geolocation error code:", error.code);
            console.error("Geolocation error message:", error.message);

            let toastMessage = "";
            let toastType = "info";

            switch (error.code) {
              case 1: // PERMISSION_DENIED
                showWarning(
                  "Location access denied. For the best experience, please enable location access to see nearby flood reports. Showing reports near Cebu City instead."
                );
                break;
              case 2: // POSITION_UNAVAILABLE
                showInfo(
                  "Unable to determine your location. Showing reports near Cebu City."
                );
                break;
              case 3: // TIMEOUT
                showInfo(
                  "Location request timed out. Showing reports near Cebu City."
                );
                break;
              default:
                showInfo(
                  "Unable to get your location. Showing reports near Cebu City."
                );
            }
            setLocationPermissionAsked(true);

            // Fallback to Cebu City coordinates
            setUserLocation({
              lat: 10.3157,
              lng: 123.8854,
            });
          },
          {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 300000,
          }
        );
      } else {
        showWarning(
          "Geolocation is not supported by your browser. Showing reports near Cebu City."
        );
        setLocationPermissionAsked(true);
        // Fallback to Cebu City coordinates
        setUserLocation({
          lat: 10.3157,
          lng: 123.8854,
        });
      }
    }
  }, [locationPermissionAsked, showToast]);

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

          <div className="header-actions">
            <button
              className="location-btn"
              onClick={() => {
                setLocationPermissionAsked(false);
              }}
              title="Refresh location"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Refresh Location
            </button>
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
        </div>

        <div className="reports-grid" id="reportsGrid">
          {loading && reports.length === 0 ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="no-reports">
              <p>
                {searchTerm
                  ? `No reports found matching "${searchTerm}"`
                  : "No flood reports found in your area."}
              </p>
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

              {isFetchingMore && hasMore && (
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

      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </>
  );
}
