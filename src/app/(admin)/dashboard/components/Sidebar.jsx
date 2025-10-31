"use client";

import { useState, useEffect } from "react";
import "./Sidebar.css";

export const Sidebar = () => {
  const [activeSection, setActiveSection] = useState("map");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    {
      id: "map",
      label: "Map",
      href: "#mapSection",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      ),
    },
    {
      id: "reports",
      label: "Reports",
      href: "#reportsSection",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
      ),
    },
    {
      id: "alerts",
      label: "Alerts",
      href: "#alertsSection",
      icon: (
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
      ),
    },
    {
      id: "hotlines",
      label: "Emergency Hotlines",
      href: "#hotlinesSection",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
      ),
    },
    {
      id: "statistics",
      label: "Statistics",
      href: "#statisticsSection",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="12" y1="20" x2="12" y2="10"></line>
          <line x1="18" y1="20" x2="18" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="16"></line>
        </svg>
      ),
    },
    {
      id: "logs",
      label: "System Logs",
      href: "#logsSection",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <line x1="10" y1="9" x2="8" y2="9"></line>
        </svg>
      ),
    },
  ];

  useEffect(() => {
    // Scroll spy to update active section
    const sections = document.querySelectorAll(".content-section");

    const observerOptions = {
      root: null,
      rootMargin: "-80px 0px -80% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          // Convert section ID to nav item ID (remove 'Section' suffix)
          const navId = sectionId.replace("Section", "");
          setActiveSection(navId);
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  const handleNavClick = (e, href, id) => {
    e.preventDefault();
    const targetSection = document.querySelector(href);

    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setActiveSection(id);

    // Close mobile sidebar
    if (window.innerWidth <= 968) {
      setIsMobileOpen(false);
    }
  };

  // Listen to mobile menu button clicks from Navbar
  useEffect(() => {
    const handleMobileMenuToggle = (e) => {
      if (e.detail && e.detail.action === "toggleSidebar") {
        setIsMobileOpen((prev) => !prev);
      }
    };

    window.addEventListener("mobileMenuToggle", handleMobileMenuToggle);

    return () => {
      window.removeEventListener("mobileMenuToggle", handleMobileMenuToggle);
    };
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (window.innerWidth <= 968 && isMobileOpen) {
        const sidebar = document.getElementById("sidebarLeft");
        const mobileMenuBtn = document.getElementById("mobileMenuBtn");

        if (
          sidebar &&
          !sidebar.contains(e.target) &&
          mobileMenuBtn &&
          !mobileMenuBtn.contains(e.target)
        ) {
          setIsMobileOpen(false);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMobileOpen]);

  return (
    <aside
      className={`sidebar-left ${isMobileOpen ? "active" : ""}`}
      id="sidebarLeft"
    >
      <div className="sidebar-header">
        <h3>Dashboard</h3>
      </div>
      <ul className="sidebar-nav">
        {navItems.map((item) => (
          <li key={item.id} className="nav-item">
            <a
              href={item.href}
              className={`nav-link ${
                activeSection === item.id ? "active" : ""
              }`}
              data-section={item.id}
              onClick={(e) => handleNavClick(e, item.href, item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};
