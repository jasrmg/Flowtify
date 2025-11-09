"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./ReportDetailsModal.module.css";

export const ReportDetailsModal = ({ report, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen || !report) return null;

  const statusClass = `status-${report.status}`;
  const statusText =
    report.status.charAt(0).toUpperCase() + report.status.slice(1);

  // Format location from Firestore structure
  const formatLocation = (location) => {
    if (typeof location === "object" && location !== null) {
      if (location.brg && location.city) {
        return `${location.brg}, ${location.city}`;
      }
      return "Unknown location";
    }
    return location || "Unknown location";
  };

  // Format timestamp from Firestore
  const formatTimestamp = () => {
    if (report.createdAt?.toDate) {
      const date = report.createdAt.toDate();
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
    return report.timestamp || "Unknown time";
  };

  const photos = report.photoUrl
    ? Array.isArray(report.photoUrl)
      ? report.photoUrl
      : [report.photoUrl]
    : [];

  const hasMultiplePhotos = photos.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % photos.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  const handleFullscreenNav = (e, direction) => {
    e.stopPropagation();
    if (direction === "next") {
      nextImage();
    } else {
      previousImage();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className={styles.modalBody}>
          <div className={styles.modalImageSection}>
            {photos.length > 0 ? (
              <div className={styles.imageGallery}>
                <Image
                  src={photos[currentImageIndex]}
                  alt={`Flood report at ${formatLocation(report.location)}`}
                  className={styles.modalImage}
                  onClick={openFullscreen}
                  style={{ cursor: "pointer" }}
                  width={400}
                  height={400}
                />
                {hasMultiplePhotos && (
                  <>
                    {currentImageIndex > 0 && (
                      <button
                        className={`${styles.galleryNav} ${styles.prev}`}
                        onClick={previousImage}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                      </button>
                    )}
                    {currentImageIndex < photos.length - 1 && (
                      <button
                        className={`${styles.galleryNav} ${styles.next}`}
                        onClick={nextImage}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </button>
                    )}
                    <div className={styles.galleryIndicator}>
                      {currentImageIndex + 1} / {photos.length}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className={styles.modalPlaceholder}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                </svg>
              </div>
            )}
          </div>

          <div className={styles.modalDetails}>
            <div className={styles.modalHeader}>
              <span className={`${styles.reportStatus} ${styles[statusClass]}`}>
                {statusText}
              </span>
              {report.severity && (
                <span
                  className={`${styles.severityBadge} ${
                    styles[`severity-${report.severity}`]
                  }`}
                >
                  {report.severity.charAt(0).toUpperCase() +
                    report.severity.slice(1)}{" "}
                  Severity
                </span>
              )}
            </div>

            <h2 className={styles.modalLocation}>
              {formatLocation(report.location)}
            </h2>

            <div className={styles.modalMeta}>
              <div className={styles.metaItem}>
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
              <div className={styles.metaItem}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Reported by {report.reporterName || "Anonymous"}</span>
              </div>
            </div>

            <div className={styles.modalDescription}>
              <h3>Description</h3>
              <p>{report.fullDescription || report.description}</p>
            </div>

            {report.date && (
              <div className={styles.modalDate}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>{report.date}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {isFullscreen && photos.length > 0 && (
        <div
          className={styles.fullscreenOverlay}
          onClick={(e) => {
            e.stopPropagation();
            closeFullscreen();
          }}
        >
          <button
            className={styles.fullscreenClose}
            onClick={(e) => {
              e.stopPropagation();
              closeFullscreen();
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <Image
            src={photos[currentImageIndex]}
            alt={`Flood report at ${formatLocation(report.location)}`}
            className={styles.fullscreenImage}
            onClick={(e) => e.stopPropagation()}
            width={800}
            height={600}
          />

          {hasMultiplePhotos && (
            <>
              {currentImageIndex > 0 && (
                <button
                  className={`${styles.fullscreenNav} ${styles.prev}`}
                  onClick={(e) => handleFullscreenNav(e, "prev")}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
              )}
              {currentImageIndex < photos.length - 1 && (
                <button
                  className={`${styles.fullscreenNav} ${styles.next}`}
                  onClick={(e) => handleFullscreenNav(e, "next")}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              )}
              <div className={styles.fullscreenIndicator}>
                {currentImageIndex + 1} / {photos.length}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
