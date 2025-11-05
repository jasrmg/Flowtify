"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import "./UserSidebar.css";

export const UserSidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  // Listen for mobile menu toggle from Navbar
  useEffect(() => {
    const handleMobileMenuToggle = () => {
      setIsMobileOpen((prev) => !prev);
    };

    window.addEventListener("mobileMenuToggle", handleMobileMenuToggle);

    return () => {
      window.removeEventListener("mobileMenuToggle", handleMobileMenuToggle);
    };
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (window.innerWidth <= 968) {
        const sidebar = document.getElementById("userSidebarLeft");
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
  }, []);

  const navItems = [
    {
      href: "/feed",
      label: "Home / Feed",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),
    },
    {
      href: "/map",
      label: "Map View",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
          <line x1="8" y1="2" x2="8" y2="18"></line>
          <line x1="16" y1="6" x2="16" y2="22"></line>
        </svg>
      ),
    },

    {
      href: "/settings",
      label: "Settings",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"></path>
        </svg>
      ),
    },
  ];

  return (
    <aside
      className={`sidebar-left ${isMobileOpen ? "active" : ""}`}
      id="userSidebarLeft"
    >
      <ul className="sidebar-nav">
        {navItems.map((item) => (
          <li key={item.href} className="nav-item">
            <Link
              href={item.href}
              className={`nav-link ${pathname === item.href ? "active" : ""}`}
              onClick={() => setIsMobileOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default UserSidebar;
