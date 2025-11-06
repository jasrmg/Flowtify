"use client";

import { useState, useEffect, useRef } from "react";

export const AlertModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const scrollPosition = useRef(0);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    severity: "low",
    message: "",
  });

  // dont allow scroll if the modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      scrollPosition.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPosition.current}px`;
      document.body.style.width = "100%";
      document.body.classList.add("modal-open");
    } else if (scrollPosition.current !== 0) {
      // Restore scroll position
      const savedPosition = scrollPosition.current;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.classList.remove("modal-open");

      // Use requestAnimationFrame to ensure styles are applied before scrolling
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

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (formData.title && formData.location && formData.message) {
      await onSubmit(formData);
      // Reset form
      setFormData({
        title: "",
        location: "",
        severity: "low",
        message: "",
      });
    } else {
      alert("Please fill in all fields!");
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      title: "",
      location: "",
      severity: "low",
      message: "",
    });
    onClose();
  };

  return (
    <div className="modal active">
      <div className="modal-overlay" onClick={handleCancel}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Alert</h2>
          <button
            className="modal-close"
            onClick={handleCancel}
            disabled={isSubmitting}
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
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="alertTitle">Alert Title</label>
            <input
              type="text"
              id="alertTitle"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Severe Flooding Warning"
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="alertLocation">Location</label>
            <input
              type="text"
              id="alertLocation"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Barangay Lahug, Gorordo Ave"
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="alertSeverity">Severity Level</label>
            <select
              id="alertSeverity"
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="alertMessage">Message</label>
            <textarea
              id="alertMessage"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              placeholder="Enter detailed alert message..."
              disabled={isSubmitting}
            ></textarea>
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="modal-btn cancel-btn"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className="modal-btn submit-btn"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Creating...
              </>
            ) : (
              "Create Alert"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
