"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

import { useNotifications } from "@/hooks/useNotifications";
import {
  getNotificationIcon,
  getNotificationIconClass,
  formatNotificationTime,
} from "@/utils/notificationHelpers";

import "./Navbar.css";

export const Navbar = () => {
  const { currentUser, logout, loading } = useAuth();
  const {
    notifications,
    loading: notificationsLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications(currentUser?.uid);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Show loading state while auth is initializing
  if (loading) {
    return (
      <nav className="navbar">
        <a href="#" className="navbar-brand">
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
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
        <div className="navbar-right">
          <div className="user-profile">
            <div className="profile-avatar loading-skeleton"></div>
          </div>
        </div>
      </nav>
    );
  }

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

  const handleLogout = async () => {
    await logout();
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!currentUser) return "U";

    const firstName = currentUser.firstName || "";
    const lastName = currentUser.lastName || "";

    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    } else if (firstName) {
      return firstName.charAt(0).toUpperCase();
    } else if (currentUser.email) {
      return currentUser.email.charAt(0).toUpperCase();
    }

    return "U";
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!currentUser) return "User";

    const firstName = currentUser.firstName || "";
    const lastName = currentUser.lastName || "";

    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    } else if (currentUser.email) {
      return currentUser.email.split("@")[0];
    }

    return "User";
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
            {unreadCount > 0 && (
              <span className="notification-badge" id="notificationBadge">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
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
              {unreadCount > 0 && (
                <button
                  className="mark-all-read-btn"
                  onClick={markAllAsRead}
                  title="Mark all as read"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </button>
              )}
            </div>
            <div className="notification-list">
              {notificationsLoading ? (
                <div className="notification-loading">
                  <div className="spinner-large"></div>
                  <p>Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="notification-empty">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  <p>No notifications yet</p>
                  <span>You're all caught up!</span>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item ${
                      !notification.isRead ? "unread" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div
                      className={`notification-icon ${getNotificationIconClass(
                        notification.type
                      )}`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="notification-content">
                      <div className="notification-title">
                        {notification.title}
                      </div>
                      <div className="notification-text">
                        {notification.body}
                      </div>
                      <div className="notification-time">
                        {formatNotificationTime(notification.createdAt)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="user-profile">
          <button
            className="profile-btn"
            id="profileBtn"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            {currentUser?.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={getUserDisplayName()}
                className="profile-avatar-img"
              />
            ) : (
              <div className="profile-avatar">{getUserInitials()}</div>
            )}
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
            <div className="dropdown-user-info">
              {currentUser?.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={getUserDisplayName()}
                  className="dropdown-avatar-img"
                />
              ) : (
                <div className="dropdown-avatar">{getUserInitials()}</div>
              )}
              <div className="dropdown-user-text">
                <div className="dropdown-user-name">{getUserDisplayName()}</div>
                <div className="dropdown-user-email">{currentUser?.email}</div>
              </div>
            </div>
            <div className="dropdown-divider"></div>
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
