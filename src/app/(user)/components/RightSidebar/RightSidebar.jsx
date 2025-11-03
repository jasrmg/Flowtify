"use client";
import { useState, useEffect } from "react";
import "./RightSidebar.css";

export const RightSidebar = () => {
  const [currentTip, setCurrentTip] = useState(0);

  const safetyTips = [
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      ),
      text: "Never walk through moving water. Six inches of moving water can knock you down.",
    },
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      ),
      text: "Keep important documents and valuables in waterproof containers in elevated areas.",
    },
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
          <line x1="6" y1="1" x2="6" y2="4"></line>
          <line x1="10" y1="1" x2="10" y2="4"></line>
          <line x1="14" y1="1" x2="14" y2="4"></line>
        </svg>
      ),
      text: "Prepare an emergency kit with flashlight, radio, first aid supplies, and food.",
    },
  ];

  // Auto-rotate tips
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % safetyTips.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [safetyTips.length]);

  return (
    <aside className="sidebar-right" id="sidebarRight">
      <div className="sidebar-section">
        <h3>Emergency & Safety Info</h3>
      </div>

      <div className="sidebar-section">
        <h4>Official Alerts</h4>
        <div className="alert-item alert-warning">
          <div className="alert-title">Heavy Rain Warning</div>
          <div className="alert-time">Active now</div>
          <p>
            Expect continuous rainfall in Metro Cebu. Stay alert for possible
            flooding.
          </p>
        </div>
        <div className="alert-item alert-info">
          <div className="alert-title">Weather Update</div>
          <div className="alert-time">2 hours ago</div>
          <p>
            Low pressure area detected east of Visayas. Monitor local updates.
          </p>
        </div>
      </div>

      <div className="sidebar-section">
        <h4>Emergency Hotlines</h4>
        <ul className="hotline-list">
          <li className="hotline-item">
            <div className="hotline-info">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span className="hotline-name">NDRRMC</span>
            </div>
            <span className="hotline-number">911</span>
          </li>
          <li className="hotline-item">
            <div className="hotline-info">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span className="hotline-name">Red Cross</span>
            </div>
            <span className="hotline-number">143</span>
          </li>
          <li className="hotline-item">
            <div className="hotline-info">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span className="hotline-name">Cebu CDRRMO</span>
            </div>
            <span className="hotline-number">(032) 261-9696</span>
          </li>
        </ul>
      </div>

      <div className="sidebar-section">
        <h4>Safety Tips</h4>
        <div className="tips-carousel">
          {safetyTips.map((tip, index) => (
            <div
              key={index}
              className={`tip-content ${index === currentTip ? "active" : ""}`}
            >
              {tip.icon}
              <p>{tip.text}</p>
            </div>
          ))}
        </div>
        <div className="carousel-dots">
          {safetyTips.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentTip ? "active" : ""}`}
              onClick={() => setCurrentTip(index)}
            ></span>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h4>Resource Links</h4>
        <ul className="resource-links">
          <li>
            <a
              href="https://bagong.pagasa.dost.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              PAGASA Weather
            </a>
          </li>
          <li>
            <a
              href="https://ndrrmc.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              NDRRMC
            </a>
          </li>
          <li>
            <a
              href="https://noah.up.edu.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              Project NOAH
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default RightSidebar;
