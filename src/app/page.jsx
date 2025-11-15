"use client";

import { useState } from "react";
import Link from "next/link";
import LandingNavbar from "./components/LandingNavbar";
import ThemeToggle from "./components/ThemeToggle";
import Modal from "./(admin)/dashboard/components/Modals/Modal";
import "./landing.css";

export default function LandingPage() {
  const [activeModal, setActiveModal] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const openModal = (modalName) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert(
      `Thank you for contacting us!\n\nName: ${contactForm.name}\nEmail: ${contactForm.email}\n\nWe'll get back to you soon!`
    );
    setContactForm({ name: "", email: "", message: "" });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <LandingNavbar
        onAboutClick={() => scrollToSection("about")}
        onContactClick={() => scrollToSection("contact")}
      />
      <ThemeToggle />

      <div id="landingPage">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <div className="hero-logo">
              <svg
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 50C10 50 20 30 40 30C60 30 70 50 70 50"
                  stroke="#3FA9F5"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M16 60C16 60 24 44 40 44C56 44 64 60 64 60"
                  stroke="#32B67A"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="30" cy="20" r="4" fill="#3FA9F5" />
                <circle cx="50" cy="16" r="4" fill="#3FA9F5" />
                <circle cx="40" cy="24" r="3" fill="#3FA9F5" />
              </svg>
            </div>
            <h1>Flowtify</h1>
            <p className="tagline">When it pours, we notify</p>
            <p className="sub-tagline">
              Because getting wet shouldn&apos;t be a surprise
            </p>
            <div className="hero-buttons">
              <Link href="/auth" className="btn btn-primary">
                Get Started
              </Link>
              <button
                className="btn btn-secondary"
                style={{ alignItems: "center", fontSize: "1rem" }}
                onClick={() => scrollToSection("about")}
              >
                Learn More
              </button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about-section">
          <div className="section-container">
            <h2 className="section-title">About Flowtify</h2>
            <p className="section-subtitle">
              Community-driven flood monitoring for safer communities
            </p>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <h3>Real-time Alerts</h3>
                <p>
                  Get instant notifications about flood conditions in your area.
                  Stay informed and stay safe with real-time updates from your
                  community.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3>Community Reports</h3>
                <p>
                  Share and verify flood reports with your neighbors. Build a
                  network of trust and collective safety in your community.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <h3>Interactive Maps</h3>
                <p>
                  Visualize flood-prone areas and safe zones with our
                  interactive mapping system. Plan your routes and stay
                  prepared.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                </div>
                <h3>Emergency Hotlines</h3>
                <p>
                  Quick access to emergency contacts and hotlines. Get help fast
                  when you need it most during flood situations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact-section">
          <div className="section-container">
            <h2 className="section-title">Get in Touch</h2>
            <p className="section-subtitle">
              Have questions? We&apos;d love to hear from you
            </p>

            <div className="contact-content">
              <div className="contact-info">
                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <h4>Location</h4>
                    <p>Cebu City, Philippines</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div>
                    <h4>Email</h4>
                    <p>support@flowtify.com</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <h4>Phone</h4>
                    <p>+63 123 456 7890</p>
                  </div>
                </div>
              </div>

              <form className="contact-form" onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <label htmlFor="contactName">Name</label>
                  <input
                    type="text"
                    id="contactName"
                    placeholder="Your name"
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contactEmail">Email</label>
                  <input
                    type="email"
                    id="contactEmail"
                    placeholder="your@email.com"
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contactMessage">Message</label>
                  <textarea
                    id="contactMessage"
                    placeholder="Your message here..."
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        message: e.target.value,
                      })
                    }
                    rows="5"
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary submit-btn">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer>
          <div className="footer-links">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                openModal("privacy");
              }}
            >
              Privacy Policy
            </a>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                openModal("terms");
              }}
            >
              Terms of Service
            </a>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("contact");
              }}
            >
              Contact
            </a>
          </div>
          <p className="copyright">
            &copy; 2025 Flowtify. All rights reserved.
          </p>
        </footer>
      </div>

      {/* Privacy Policy Modal */}
      <Modal
        isOpen={activeModal === "privacy"}
        onClose={closeModal}
        title="Privacy Policy"
      >
        <div className="modal-field">
          <h3 style={{ marginBottom: "1rem", color: "var(--text-primary)" }}>
            Information We Collect
          </h3>
          <p>
            Flowtify collects information you provide directly to us, such as
            when you create an account, submit flood reports, or contact us for
            support. This may include your name, email address, location data,
            and any content you submit through our platform.
          </p>
        </div>

        <div className="modal-field">
          <h3 style={{ marginBottom: "1rem", color: "var(--text-primary)" }}>
            How We Use Your Information
          </h3>
          <p>
            We use the information we collect to provide, maintain, and improve
            our services, including to send you real-time flood alerts, verify
            community reports, and enhance our flood monitoring capabilities. We
            may also use your information to communicate with you about updates,
            safety tips, and emergency notifications.
          </p>
        </div>

        <div className="modal-field">
          <h3 style={{ marginBottom: "1rem", color: "var(--text-primary)" }}>
            Information Sharing
          </h3>
          <p>
            We do not sell, trade, or rent your personal information to third
            parties. We may share your information with local authorities and
            emergency services when necessary for public safety and disaster
            response. Community-submitted reports may be visible to other users
            to facilitate collaborative flood monitoring.
          </p>
        </div>

        <div className="modal-field">
          <h3 style={{ marginBottom: "1rem", color: "var(--text-primary)" }}>
            Data Security
          </h3>
          <p>
            We implement appropriate security measures to protect your personal
            information from unauthorized access, alteration, disclosure, or
            destruction. However, no method of transmission over the Internet is
            100% secure, and we cannot guarantee absolute security.
          </p>
        </div>

        <div className="modal-field">
          <h3 style={{ marginBottom: "1rem", color: "var(--text-primary)" }}>
            Your Rights
          </h3>
          <p>
            You have the right to access, update, or delete your personal
            information at any time. You may also opt out of certain
            communications. To exercise these rights, please contact us at
            privacy@flowtify.com.
          </p>
        </div>

        <div className="modal-field">
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Last updated: November 1, 2025
          </p>
        </div>
      </Modal>

      {/* Terms of Service Modal */}
      <Modal
        isOpen={activeModal === "terms"}
        onClose={closeModal}
        title="Terms of Service"
      >
        <div className="modal-field">
          <h3 style={{ marginBottom: "1rem", color: "var(--text-primary)" }}>
            Acceptance of Terms
          </h3>
          <p>
            By accessing and using Flowtify, you accept and agree to be bound by
            these Terms of Service. If you do not agree to these terms, please
            do not use our services.
          </p>
        </div>

        <div className="modal-field">
          <h3 style={{ marginBottom: "1rem", color: "var(--text-primary)" }}>
            User Responsibilities
          </h3>
          <p>
            You are responsible for providing accurate and truthful information
            when submitting flood reports. False or misleading reports may
            result in account suspension or termination. You agree to use
            Flowtify in a manner that does not disrupt or interfere with the
            platform&apos;s operation or other users&apos; experience.
          </p>
        </div>

        <div className="modal-field">
          <h3 style={{ marginBottom: "1rem", color: "var(--text-primary)" }}>
            Content and Liability
          </h3>
          <p>
            Flowtify provides flood monitoring and reporting services based on
            community-submitted data. While we strive for accuracy, we cannot
            guarantee the completeness or reliability of all information. Users
            should exercise their own judgment and consult official emergency
            services for critical decisions. Flowtify is not liable for any
            damages resulting from the use or inability to use our services.
          </p>
        </div>

        <div className="modal-field">
          <h3 style={{ marginBottom: "1rem", color: "var(--text-primary)" }}>
            Intellectual Property
          </h3>
          <p>
            All content, features, and functionality of Flowtify are owned by us
            and are protected by intellectual property laws. You may not copy,
            modify, distribute, or create derivative works without our express
            written permission.
          </p>
        </div>

        <div className="modal-field">
          <h3 style={{ marginBottom: "1rem", color: "var(--text-primary)" }}>
            Emergency Services Disclaimer
          </h3>
          <p>
            Flowtify is not a replacement for official emergency services. In
            case of immediate danger or emergency, always contact local
            authorities and emergency services directly. Our platform is
            designed to complement, not replace, official disaster response
            systems.
          </p>
        </div>

        <div className="modal-field">
          <h3 style={{ marginBottom: "1rem", color: "var(--text-primary)" }}>
            Changes to Terms
          </h3>
          <p>
            We reserve the right to modify these terms at any time. Continued
            use of Flowtify after changes constitutes acceptance of the modified
            terms.
          </p>
        </div>

        <div className="modal-field">
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Last updated: November 1, 2025
          </p>
        </div>
      </Modal>
    </>
  );
}
