"use client";
import { useState, useEffect } from "react";

import "./Navbar.css";

export const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // close profile dropdown
      const profileDropdown = document.getElementById("profileDropdown");
      const profileBtn = document.getElementById("profileBtn");

      if (
        profileDropdown &&
        !profileDropdown.contains(e.target) &&
        profileBtn &&
        !profileBtn.contains(e.target)
      ) {
        setIsProfileOpen(false);
      }

      // close notification dropdown (only for desktop)
      if (window.innerWidth > 480) {
        const notificationDropdown = document.getElementById(
          "notificationDropdown"
        );
        const notificationBtn = document.getElementById("notificationBtn");
        if (
          notificationDropdown &&
          !notificationDropdown.contains(e.target) &&
          notificationBtn &&
          !notificationBtn.contains(e.target)
        ) {
          setIsNotificationOpen(false);
        }
      }

      // close search bar (only for mobile)
      if (window.innerWidth <= 480) {
        const searchBar = document.getElementById("searchBar");
        const searchToggleBtn = document.getElementById("searchToggleBtn");
        const searchCloseBtn = document.getElementById("searchCloseBtn");

        if (
          searchBar &&
          !searchBar.contains(e.target) &&
          searchToggleBtn &&
          !searchToggleBtn.contains(e.target) &&
          searchCloseBtn &&
          !searchCloseBtn.contains(e.target)
        ) {
          setIsSearchOpen(false);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Auto-focus search input when opened on mobile
  useEffect(() => {
    if (isSearchOpen && window.innerWidth <= 480) {
      const searchInput = document.getElementById("searchInput");
      // Use setTimeout to ensure the DOM has updated
      setTimeout(() => {
        searchInput?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  // handle body class and navbar class
  useEffect(() => {
    const navbar = document.querySelector(".navbar");
    if (isSearchOpen) {
      navbar?.classList.add("search-active");
    } else {
      navbar?.classList.remove("search-active");
    }
  }, [isSearchOpen]);

  // Handle notification overlay for mobile
  useEffect(() => {
    const navbar = document.querySelector(".navbar");
    if (isNotificationOpen) {
      if (window.innerWidth <= 480) {
        navbar?.classList.add("overlay-active", "notification-overlay");
        document.body.classList.add("overlay-open");
      } else if (window.innerWidth <= 968) {
        document.body.classList.add("notification-open");
      }
    } else {
      navbar?.classList.remove("overlay-active", "notification-overlay");
      document.body.classList.remove("overlay-open", "notification-open");
    }
  }, [isNotificationOpen]);

  const handleLogout = () => {
    console.log("logout");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);

    // Dispatch event for Sidebar to listen
    window.dispatchEvent(
      new CustomEvent("mobileMenuToggle", {
        detail: { action: "toggleSidebar" },
      })
    );
  };

  return (
    <nav className="navbar">
      <button
        className="mobile-menu-btn"
        id="mobileMenuBtn"
        onClick={toggleMobileMenu}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
      </button>

      <a href="#" className="navbar-brand">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5 25C5 25 10 15 20 15C30 15 35 25 35 25"
            stroke="#3FA9F5"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M8 30C8 30 12 22 20 22C28 22 32 30 32 30"
            stroke="#32B67A"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="15" cy="10" r="2" fill="#3FA9F5" />
          <circle cx="25" cy="8" r="2" fill="#3FA9F5" />
          <circle cx="20" cy="12" r="1.5" fill="#3FA9F5" />
        </svg>
        <span>Flowtify</span>
      </a>

      <button
        className="search-toggle-btn"
        id="searchToggleBtn"
        aria-label="Toggle search"
        onClick={() => setIsSearchOpen(!isSearchOpen)}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </button>

      <div
        className={`search-bar ${isSearchOpen ? "mobile-expanded" : ""}`}
        id="searchBar"
      >
        <svg
          className="search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          type="text"
          placeholder="Search by location or baranggay..."
          id="searchInput"
        />
        <button
          className="search-close-btn"
          id="searchCloseBtn"
          aria-label="Close search"
          onClick={() => setIsSearchOpen(false)}
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

      <div className="navbar-right">
        <div className="notification-container">
          <button
            className="notification-btn"
            id="notificationBtn"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="notification-badge" id="notificationBadge">
              2
            </span>
          </button>

          <div
            className={`notification-dropdown ${
              isNotificationOpen ? "active" : ""
            }`}
            id="notificationDropdown"
          >
            <div className="notification-header">
              <button
                className="notification-back-btn"
                id="notificationBackBtn"
                onClick={() => setIsNotificationOpen(false)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </button>
              <h4>Notifications</h4>
            </div>
            <div className="notification-list">
              <div className="notification-item unread">
                <div className="notification-icon warning">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </div>
                <div className="notification-content">
                  <div className="notification-title">
                    Flood Alert - Barangay Lahug
                  </div>
                  <div className="notification-text">
                    Severe flooding reported at Gorordo Ave. Water level rising.
                  </div>
                  <div className="notification-time">10 minutes ago</div>
                </div>
              </div>

              <div className="notification-item unread">
                <div className="notification-icon info">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="20" y1="8" x2="20" y2="14"></line>
                    <line x1="23" y1="11" x2="17" y2="11"></line>
                  </svg>
                </div>
                <div className="notification-content">
                  <div className="notification-title">
                    New User Registration
                  </div>
                  <div className="notification-text">
                    15 new users registered in the last 24 hours.
                  </div>
                  <div className="notification-time">2 hours ago</div>
                </div>
              </div>

              <div className="notification-item">
                <div className="notification-icon success">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div className="notification-content">
                  <div className="notification-title">
                    System Backup Complete
                  </div>
                  <div className="notification-text">
                    Daily backup completed successfully. All data secured.
                  </div>
                  <div className="notification-time">4 hours ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="user-profile">
          <button
            className="profile-btn"
            id="profileBtn"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="profile-avatar">JS</div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          <div
            className={`profile-dropdown ${isProfileOpen ? "active" : ""}`}
            id="profileDropdown"
          >
            <a href="#" className="dropdown-item">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              View Profile
            </a>
            <a href="#" className="dropdown-item">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6"></path>
              </svg>
              Settings
            </a>
            <button
              className="dropdown-item"
              id="logoutBtn"
              onClick={handleLogout}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
