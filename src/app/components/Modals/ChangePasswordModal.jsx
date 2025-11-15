"use client";

import { useState, useEffect, useRef } from "react";
import { Toast } from "@/components/Toast/Toast";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

export default function ChangePasswordModal({ isOpen, onClose, user }) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isChanging, setIsChanging] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "info",
  });

  const modalRef = useRef(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
      setShowPasswords({
        current: false,
        new: false,
        confirm: false,
      });
    }
  }, [isOpen]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword =
        "New password must be different from current password";
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

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Handle change password
  const handleChangePassword = async () => {
    if (!validateForm()) {
      setToast({
        isVisible: true,
        message: "Please fix the errors before submitting",
        type: "error",
      });
      return;
    }

    if (!user) {
      setToast({
        isVisible: true,
        message: "User not authenticated. Please log in again.",
        type: "error",
      });
      return;
    }

    setIsChanging(true);

    try {
      // Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(
        user.email,
        formData.currentPassword
      );

      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, formData.newPassword);

      setToast({
        isVisible: true,
        message: "Password changed successfully!",
        type: "success",
      });

      // Close modal after short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      let errorMessage = "Failed to change password. Please try again.";

      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        errorMessage = "Current password is incorrect";
        setErrors({ currentPassword: errorMessage });
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak";
        setErrors({ newPassword: errorMessage });
      } else if (error.code === "auth/requires-recent-login") {
        errorMessage =
          "Please log out and log in again before changing password";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many attempts. Please try again later";
      }

      setToast({
        isVisible: true,
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsChanging(false);
    }
  };

  // Handle close
  const handleClose = () => {
    const hasInput = Object.values(formData).some(
      (value) => value.trim() !== ""
    );

    if (hasInput) {
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
            <h2>Change Password</h2>
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
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
                marginBottom: "1.5rem",
              }}
            >
              Enter your current password and choose a new password
            </p>

            {/* Current Password */}
            <div className="form-group">
              <label htmlFor="currentPassword">
                Current Password <span style={{ color: "#ff6b6b" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPasswords.current ? "text" : "password"}
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder="Enter current password"
                  style={{ paddingRight: "3rem" }}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                    padding: "0.25rem",
                  }}
                >
                  {showPasswords.current ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <span className="error-message">{errors.currentPassword}</span>
              )}
            </div>

            {/* New Password */}
            <div className="form-group">
              <label htmlFor="newPassword">
                New Password <span style={{ color: "#ff6b6b" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPasswords.new ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter new password (min. 6 characters)"
                  style={{ paddingRight: "3rem" }}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                    padding: "0.25rem",
                  }}
                >
                  {showPasswords.new ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <span className="error-message">{errors.newPassword}</span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirm New Password <span style={{ color: "#ff6b6b" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Re-enter new password"
                  style={{ paddingRight: "3rem" }}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                    padding: "0.25rem",
                  }}
                >
                  {showPasswords.confirm ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button className="modal-btn cancel-btn" onClick={handleClose}>
              Cancel
            </button>
            <button
              className="modal-btn submit-btn"
              onClick={handleChangePassword}
              disabled={isChanging}
            >
              {isChanging ? (
                <>
                  <span className="cp-spinner" />
                  Changing...
                </>
              ) : (
                "Change Password"
              )}
            </button>
          </div>
        </div>
      </div>

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
