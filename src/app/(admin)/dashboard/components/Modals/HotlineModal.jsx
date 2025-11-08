"use client";

import { useState, useEffect, useRef } from "react";

export const HotlineModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  hotline = null,
  showSuccess,
  showError,
}) => {
  const scrollPosition = useRef(0);
  const isEditMode = !!hotline;

  const [formData, setFormData] = useState({
    agencyName: "",
    contactNumber: "",
    description: "",
  });

  // Populate form when editing
  useEffect(() => {
    if (hotline) {
      setFormData({
        agencyName: hotline.agencyName || "",
        contactNumber: hotline.contactNumber || "",
        description: hotline.description || "",
      });
    }
  }, [hotline]);

  // dont allow scroll if the modal is open
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

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const { agencyName, contactNumber, description } = formData;
    if (!agencyName || !contactNumber || !description) {
      showError("Please fill in all fields!");
      return;
    }

    const cleanNumber = contactNumber.replace(/\D/g, "");

    if (cleanNumber.length < 7 || cleanNumber.length > 11) {
      showError("Please enter a valid contact number (7 to 11 digits).");
      return;
    }

    try {
      const formDataSubmit = {
        ...formData,
        contactNumber: cleanNumber,
      };
      await onSubmit(formDataSubmit, hotline?.id);

      // Reset form
      setFormData({
        agencyName: "",
        contactNumber: "",
        description: "",
      });
    } catch (error) {
      showError("Failed to submit. Please try again.");
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      agencyName: "",
      contactNumber: "",
      description: "",
    });
    onClose();
  };

  return (
    <div className="modal active">
      <div className="modal-overlay" onClick={handleCancel}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2>
            {isEditMode ? "Edit Emergency Hotline" : "Add Emergency Hotline"}
          </h2>
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
            <label htmlFor="hotlineName">Agency Name</label>
            <input
              type="text"
              id="hotlineName"
              name="agencyName"
              value={formData.agencyName}
              onChange={handleChange}
              placeholder="e.g., Cebu City Disaster Risk Reduction"
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="hotlineNumber">Contact Number</label>
            <input
              type="tel"
              id="hotlineNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="e.g., (032) 123-4567"
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="hotlineDescription">Description</label>
            <textarea
              id="hotlineDescription"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Brief description of service..."
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
                {isEditMode ? "Updating..." : "Adding..."}
              </>
            ) : isEditMode ? (
              "Update Hotline"
            ) : (
              "Add Hotline"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
