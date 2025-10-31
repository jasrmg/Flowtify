"use client";

import { useState } from "react";

export const AlertModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    severity: "low",
    message: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (formData.title && formData.location && formData.message) {
      onSubmit(formData);
      // Reset form
      setFormData({
        title: "",
        location: "",
        severity: "low",
        message: "",
      });
      onClose();
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
          <button className="modal-close" onClick={handleCancel}>
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
              placeholder="e.g., Barangay Lahug"
            />
          </div>
          <div className="form-group">
            <label htmlFor="alertSeverity">Severity Level</label>
            <select
              id="alertSeverity"
              name="severity"
              value={formData.severity}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
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
              placeholder="Enter alert message..."
            ></textarea>
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-btn cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button className="modal-btn submit-btn" onClick={handleSubmit}>
            Create Alert
          </button>
        </div>
      </div>
    </div>
  );
};
