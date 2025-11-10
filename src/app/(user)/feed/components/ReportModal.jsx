"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MapPicker } from "./MapPicker";
import Image from "next/image";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { uploadImagesToCloudinary } from "@/utils/cloudinaryHelpers";
import { Toast } from "@/components/Toast/Toast";
import "@/app/(admin)/dashboard/components/Modals/modals.css";

export const ReportModal = ({ isOpen, onClose }) => {
  const scrollPosition = useRef(0);
  const [formData, setFormData] = useState({
    description: "",
    severity: "low",
    location: null,
  });

  const [photos, setPhotos] = useState([]);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "info",
  });

  const { currentUser } = useAuth();

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      photos.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [photos]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      scrollPosition.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPosition.current}px`;
      document.body.style.width = "100%";
      document.body.classList.add("modal-open");
    } else if (scrollPosition.current !== 0) {
      const savedPosition = scrollPosition.current;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.classList.remove("modal-open");

      requestAnimationFrame(() => {
        window.scrollTo({
          top: savedPosition,
          behavior: "instant",
        });
      });
    }

    return () => {
      if (document.body.classList.contains("modal-open")) {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.classList.remove("modal-open");
      }
    };
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationSelect = useCallback((locationData) => {
    setFormData((prev) => ({
      ...prev,
      location: locationData,
    }));
  }, []);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 5 - photos.length;
    const filesToAdd = files.slice(0, remainingSlots);

    // Create preview URLs
    const photoUrls = filesToAdd.map((file) => URL.createObjectURL(file));

    // Store both preview URLs and actual File objects
    setPhotos((prev) => [...prev, ...photoUrls]);
    setPhotoFiles((prev) => [...prev, ...filesToAdd]);
  };

  const removePhoto = (index) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(photos[index]);

    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate location is selected
    if (!formData.location) {
      setToast({
        isVisible: true,
        message: "Please select a location on the map",
        type: "warning",
      });
      return;
    }

    // Validate user is logged in
    if (!currentUser) {
      setToast({
        isVisible: true,
        message: "You must be logged in to submit a report",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload photos to Cloudinary if any
      let photoUrls = [];
      if (photoFiles.length > 0) {
        const uploadResult = await uploadImagesToCloudinary(
          photoFiles,
          "flowtify/reports"
        );

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || "Failed to upload images");
        }

        photoUrls = uploadResult.urls;
      }

      // Transform location data to match Firestore structure
      const reportData = {
        userId: currentUser.uid,
        description: formData.description,
        severity: formData.severity,
        location: {
          lat: parseFloat(formData.location.lat),
          lng: parseFloat(formData.location.lng),
          brg: formData.location.barangay || "",
          city: formData.location.city || "Cebu City",
        },
        geohash: formData.location.geohash,
        photoUrl: photoUrls,
        status: "pending",
        createdAt: serverTimestamp(),
        verifiedAt: null,
        verifiedBy: null,
        resolvedAt: null,
        resolvedBy: null,
        rejectedAt: null,
        rejectedBy: null,
        rejectionReason: "",
        comments: [],
      };

      // Save to Firestore
      await addDoc(collection(db, "reports"), reportData);

      // Show success toast
      setToast({
        isVisible: true,
        message: "Report submitted successfully! Waiting for admin approval.",
        type: "success",
      });

      // Reset form
      setFormData({
        description: "",
        severity: "low",
        location: null,
      });
      setPhotos([]);
      setPhotoFiles([]);

      // Close modal after a short delay to show success message
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error submitting report:", error);
      setToast({
        isVisible: true,
        message: error.message || "Failed to submit report. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal active">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Report Flooding</h2>
          <button className="modal-close" onClick={onClose}>
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
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Location Section */}
            <div className="form-section">
              <h3 className="form-section-title">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Select Flood Location *
              </h3>

              <MapPicker
                onLocationSelect={handleLocationSelect}
                initialLocation={formData.location}
              />
            </div>

            {/* Severity */}
            <div className="form-group">
              <label htmlFor="severity">Severity Level *</label>
              <select
                id="severity"
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
                required
              >
                <option value="low">Low - Minor water accumulation</option>
                <option value="moderate">
                  Moderate - Passable with caution
                </option>
                <option value="high">High - Road partially blocked</option>
                <option value="severe">
                  Severe - Road completely impassable
                </option>
              </select>
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the flooding situation in detail..."
                rows="4"
                required
              />
            </div>

            {/* Photo Upload */}
            <div className="form-group">
              <label>Photos (Optional, max 5)</label>
              <div className="photo-upload-container">
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  style={{ display: "none" }}
                  disabled={photos.length >= 5}
                />
                <label htmlFor="photo-upload" className="photo-upload-btn">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  Upload Photos
                </label>
              </div>

              {photos.length > 0 && (
                <div className="photo-preview-grid">
                  {photos.map((photo, index) => (
                    <div key={index} className="photo-preview-item">
                      <Image
                        src={photo}
                        alt={`Preview ${index + 1}`}
                        width={100}
                        height={100}
                        unoptimized
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                      <button
                        type="button"
                        className="photo-remove-btn"
                        onClick={() => removePhoto(index)}
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
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="modal-btn cancel-btn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-btn submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="spinning"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="9 11 12 14 22 4"></polyline>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                  </svg>
                  Submit Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
        duration={3000}
      />
    </div>
  );
};
