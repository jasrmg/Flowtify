"use client";
import { useState } from "react";
import Link from "next/link";
import "./LandingNavbar.css";

export default function LandingNavbar({ onAboutClick, onContactClick }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav id="navbar">
      <div className="nav-container">
        <Link href="/" className="logo" onClick={closeMobileMenu}>
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
        </Link>

        <button
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
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

        <ul className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}>
          <li>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
                closeMobileMenu();
              }}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (onAboutClick) onAboutClick();
                closeMobileMenu();
              }}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (onContactClick) onContactClick();
                closeMobileMenu();
              }}
            >
              Contact
            </Link>
          </li>
          <li>
            <Link
              href="/auth"
              className="btn btn-primary"
              onClick={closeMobileMenu}
            >
              Sign Up
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
