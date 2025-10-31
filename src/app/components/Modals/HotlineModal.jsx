"use client";

import { useState, useEffect, useRef } from "react";

export const HotlineModal = ({ isOpen, onClose, onSubmit }) => {
  const scrollPosition = useRef(0);
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    description: "",
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

  const handleSubmit = () => {
    if (formData.name && formData.number && formData.description) {
      onSubmit(formData);
      // Reset form
      setFormData({
        name: "",
        number: "",
        description: "",
      });
      onClose();
    } else {
      alert("Please fill in all fields!");
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      name: "",
      number: "",
      description: "",
    });
    onClose();
  };

  return (
    <div className="modal active">
      <div className="modal-overlay" onClick={handleCancel}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Emergency Hotline</h2>
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
            <label htmlFor="hotlineName">Agency Name</label>
            <input
              type="text"
              id="hotlineName"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Cebu City Disaster Risk Reduction"
            />
          </div>
          <div className="form-group">
            <label htmlFor="hotlineNumber">Contact Number</label>
            <input
              type="tel"
              id="hotlineNumber"
              name="number"
              value={formData.number}
              onChange={handleChange}
              placeholder="e.g., (032) 123-4567"
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
            ></textarea>
          </div>
        </div>
        <div className="modal-footer">
          <button className="modal-btn cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button className="modal-btn submit-btn" onClick={handleSubmit}>
            Add Hotline
          </button>
        </div>
      </div>
    </div>
  );
};
