"use client";
import { useState, useEffect } from "react";
import "./ThemeToggle.css";

export const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme on component mount
  useEffect(() => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    // Priority: saved preference > system preference > light mode (default)
    if (savedTheme) {
      // User has explicitly set a preference
      const isDark = savedTheme === "dark";
      setIsDarkMode(isDark);
      if (isDark) {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }
    } else if (prefersDark) {
      // No saved preference, but system prefers dark mode
      setIsDarkMode(true);
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark"); // Save this preference
    } else {
      // No saved preference and system prefers light mode
      setIsDarkMode(false);
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light"); // Save this preference
    }
  }, []);

  // Handle theme toggle
  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;

      if (newMode) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
      }

      return newMode;
    });
  };

  return (
    <button
      className="theme-toggle"
      id="themeToggle"
      aria-label="Toggle theme"
      onClick={toggleTheme}
    >
      <svg
        id="themeIcon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        {isDarkMode ? (
          // Moon icon for dark mode
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        ) : (
          // Sun icon for light mode
          <>
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </>
        )}
      </svg>
    </button>
  );
};

export default ThemeToggle;
