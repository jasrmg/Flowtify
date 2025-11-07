"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import { MapPicker } from "./MapPicker";
import { uploadImagesToCloudinary } from "@/utils/cloudinaryHelpers";
import { logSystemAction } from "@/utils/systemLogger";

import "./modals.css";

export const CreateReportModal = ({
  isOpen,
  onClose,
  onSuccess,
  onError,
  currentUser,
}) => {
  const scrollPosition = useRef(0);
  const [formData, setFormData] = useState({
    description: "",
    severity: "low",
    location: null,
  });

  const [photos, setPhotos] = useState([]);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    console.log("📍 Selected location data:", locationData);
    setFormData((prev) => ({
      ...prev,
      location: locationData,
    }));
  }, []);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotoFiles = [...photoFiles, ...files].slice(0, 5);
    const photoUrls = newPhotoFiles.map((file) => URL.createObjectURL(file));

    setPhotoFiles(newPhotoFiles);
    setPhotos(photoUrls);
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.location) {
      onError("Please select a location on the map");
      return;
    }

    if (!currentUser) {
      onError("You must be logged in to create a report");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload photos to Cloudinary if any
      let photoUrls = [];
      if (photoFiles.length > 0) {
        const uploadResult = await uploadImagesToCloudinary(photoFiles);
        if (uploadResult.success) {
          photoUrls = uploadResult.urls;
        } else {
          throw new Error("Failed to upload images");
        }
      }

      // Create report document
      const reportData = {
        userId: currentUser.uid,
        description: formData.description,
        photoUrl: photoUrls,
        location: {
          lat: parseFloat(formData.location.lat),
          lng: parseFloat(formData.location.lng),
          brg: formData.location.barangay || "",
          city: formData.location.city || "",
        },
        geohash: formData.location.geohash || "",
        severity: formData.severity,
        status: "verified", // Admin reports are auto-verified
        createdAt: serverTimestamp(),
        verifiedAt: serverTimestamp(),
        verifiedBy: currentUser.uid,
        rejectedAt: null,
        rejectedBy: null,
        rejectionReason: "",
        comments: [],
      };

      const docRef = await addDoc(collection(db, "reports"), reportData);

      // Log the action
      await logSystemAction({
        action: "Report Created",
        description: `Admin created a flood report for ${
          reportData.location.brg ? `Barangay ${reportData.location.brg}, ` : ""
        }${reportData.location.city}`,
        targetCollection: "reports",
        targetId: docRef.id,
        userId: currentUser.uid,
        userRole: "admin",
      });

      // Reset form and close modal
      setFormData({
        description: "",
        severity: "low",
        location: null,
      });
      setPhotos([]);
      setPhotoFiles([]);
      onClose();

      if (onSuccess) {
        onSuccess("Report created successfully!");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      onError("Failed to submit report. Please try again.");
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
          <h2>Create Flood Report</h2>
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
                <option value="moderate">Medium - Passable with caution</option>
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
                  <div className="spinner"></div>
                  Creating Report...
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
                  Create Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
