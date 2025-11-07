"use client";

import { useState, useEffect, useRef } from "react";
import { Toast } from "@/components/Toast/Toast";

export default function ViewProfileModal({ isOpen, onClose, user, onSave }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    avatarUrl: "",
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [newAvatarFile, setNewAvatarFile] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "info",
  });

  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  // Initialize form data when user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        avatarUrl: user.avatarUrl || "",
      });
      setAvatarPreview(user.avatarUrl || null);
      setNewAvatarFile(null);
      setHasChanges(false);
      setErrors({});
    }
  }, [user]);

  // Check for changes
  useEffect(() => {
    if (!user) return;

    const firstNameChanged = formData.firstName !== (user.firstName || "");
    const lastNameChanged = formData.lastName !== (user.lastName || "");
    const avatarChanged = newAvatarFile !== null;

    setHasChanges(firstNameChanged || lastNameChanged || avatarChanged);
  }, [formData, newAvatarFile, user]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle avatar click
  const handleAvatarClick = () => {
    if (avatarPreview) {
      setIsLightboxOpen(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setToast({
        isVisible: true,
        message: "Please select a valid image file",
        type: "error",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setToast({
        isVisible: true,
        message: "Image size should be less than 5MB",
        type: "error",
      });
      return;
    }

    setNewAvatarFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) {
      setToast({
        isVisible: true,
        message: "Please fill in all required fields",
        type: "error",
      });
      return;
    }

    setIsSaving(true);

    try {
      await onSave({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        avatarFile: newAvatarFile,
      });

      setToast({
        isVisible: true,
        message: "Profile updated successfully",
        type: "success",
      });

      // Close modal after short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setToast({
        isVisible: true,
        message: error.message || "Failed to update profile",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle close
  const handleClose = () => {
    if (hasChanges) {
      if (
        confirm("You have unsaved changes. Are you sure you want to close?")
      ) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Get user initials
  const getInitials = () => {
    if (!user) return "";
    const firstInitial = user.firstName?.[0] || "";
    const lastInitial = user.lastName?.[0] || "";
    return (firstInitial + lastInitial).toUpperCase();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className={`modal ${isOpen ? "active" : ""}`}
        onClick={handleBackdropClick}
      >
        <div className="modal-overlay" />
        <div className="modal-content" ref={modalRef}>
          <div className="modal-header">
            <h2>View Profile</h2>
            <button className="modal-close" onClick={handleClose}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="modal-body">
            {/* Avatar Section */}
            <div className="profile-avatar-section">
              <div
                className="profile-avatar-large"
                onClick={handleAvatarClick}
                style={{ cursor: avatarPreview ? "zoom-in" : "pointer" }}
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile" />
                ) : (
                  <div className="profile-avatar-placeholder">
                    {getInitials()}
                  </div>
                )}
                <div className="avatar-overlay">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                style={{ display: "none" }}
              />
              <p className="avatar-hint">
                {avatarPreview
                  ? "Click to view full size or change photo"
                  : "Click to upload profile photo"}
              </p>
            </div>

            {/* Form Section */}
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="firstName">
                  First Name <span style={{ color: "#ff6b6b" }}>*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <span className="error-message">{errors.firstName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="lastName">
                  Last Name <span style={{ color: "#ff6b6b" }}>*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <span className="error-message">{errors.lastName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={user?.email || ""}
                  disabled
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    cursor: "not-allowed",
                    opacity: 0.7,
                  }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Role</label>
                <input
                  type="text"
                  id="role"
                  value={
                    user?.role
                      ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                      : ""
                  }
                  disabled
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    cursor: "not-allowed",
                    opacity: 0.7,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="modal-btn cancel-btn" onClick={handleClose}>
              Close
            </button>
            <button
              className="modal-btn submit-btn"
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
            >
              {isSaving ? (
                <>
                  <span className="spinner" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Avatar Lightbox */}
      {isLightboxOpen && avatarPreview && (
        <div
          className="avatar-lightbox"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div className="avatar-lightbox-overlay" />
          <button
            className="avatar-lightbox-close"
            onClick={() => setIsLightboxOpen(false)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <img
            src={avatarPreview}
            alt="Profile Full Size"
            className="avatar-lightbox-image"
          />
          <button
            className="avatar-lightbox-change"
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(false);
              fileInputRef.current?.click();
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            Change Photo
          </button>
        </div>
      )}

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
      />
    </>
  );
}
