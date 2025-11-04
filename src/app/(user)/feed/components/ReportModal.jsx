"use client";

import { useState, useEffect, useRef } from "react";
import "@/app/components/Modals/modals.css";

export const ReportModal = ({ isOpen, onClose }) => {
  const scrollPosition = useRef(0);
  const [formData, setFormData] = useState({
    description: "",
    severity: "moderate",
    location: {
      lat: "",
      lng: "",
      barangay: "",
      city: "Cebu City",
    },
  });
  const [photos, setPhotos] = useState([]);
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

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value,
      },
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    // TODO: Upload to storage and get URLs
    // For now, just create object URLs for preview
    const photoUrls = files.map((file) => URL.createObjectURL(file));
    setPhotos((prev) => [...prev, ...photoUrls].slice(0, 5)); // Max 5 photos
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement Firestore submission
      // const reportData = {
      //   userId: auth.currentUser.uid,
      //   description: formData.description,
      //   photoUrl: photos,
      //   location: formData.location,
      //   severity: formData.severity,
      //   status: 'pending',
      //   createdAt: serverTimestamp(),
      //   resolvedAt: null,
      //   verifiedBy: null,
      //   verifiedAt: null,
      //   comments: []
      // };
      // await addDoc(collection(db, 'reports'), reportData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Report submitted:", { ...formData, photos });

      // Reset form and close modal
      setFormData({
        description: "",
        severity: "moderate",
        location: {
          lat: "",
          lng: "",
          barangay: "",
          city: "Cebu City",
        },
      });
      setPhotos([]);
      onClose();

      // TODO: Show success notification
      alert("Report submitted successfully!");
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report. Please try again.");
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
                Location Details
              </h3>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="lat">Latitude *</label>
                  <input
                    type="number"
                    id="lat"
                    name="lat"
                    step="any"
                    value={formData.location.lat}
                    onChange={handleLocationChange}
                    placeholder="e.g., 10.3157"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lng">Longitude *</label>
                  <input
                    type="number"
                    id="lng"
                    name="lng"
                    step="any"
                    value={formData.location.lng}
                    onChange={handleLocationChange}
                    placeholder="e.g., 123.8854"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="barangay">Barangay *</label>
                  <input
                    type="text"
                    id="barangay"
                    name="barangay"
                    value={formData.location.barangay}
                    onChange={handleLocationChange}
                    placeholder="e.g., Lahug"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.location.city}
                    onChange={handleLocationChange}
                    placeholder="Cebu City"
                    required
                  />
                </div>
              </div>
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
                      <img src={photo} alt={`Preview ${index + 1}`} />
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
    </div>
  );
};
