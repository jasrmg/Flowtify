// Sample flood reports data
const floodReports = [
  {
    id: 1,
    location: "Barangay Lahug, Gorordo Ave",
    description:
      "Severe flooding at intersection. Water level approximately 2 feet high. Road impassable for small vehicles.",
    status: "verified",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    location: "Barangay Mabolo, Mango Ave",
    description:
      "Minor flooding reported near plaza. Pedestrian walkways affected. Situation under monitoring.",
    status: "pending",
    timestamp: "4 hours ago",
  },
  {
    id: 3,
    location: "Barangay Capitol Site",
    description:
      "Flooding has subsided. Roads are now clear and passable. Cleanup operations ongoing.",
    status: "resolved",
    timestamp: "6 hours ago",
  },
  {
    id: 4,
    location: "Barangay Guadalupe, N. Bacalso Ave",
    description:
      "Flash flooding reported due to heavy rainfall. Multiple areas affected. Avoid unnecessary travel.",
    status: "verified",
    timestamp: "1 hour ago",
  },
  {
    id: 5,
    location: "Barangay Kamputhaw",
    description:
      "Street flooding in low-lying areas. Water level rising. Residents advised to stay alert.",
    status: "verified",
    timestamp: "3 hours ago",
  },
  {
    id: 6,
    location: "Barangay Kasambagan",
    description:
      "Water accumulation near drainage areas. Monitoring ongoing for potential overflow.",
    status: "pending",
    timestamp: "5 hours ago",
  },
];

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  initializeTheme();
  renderFloodReports();
  initializeEventListeners();
  initializeResponsiveSearch();
  initializeSafetyTipsCarousel();
});

// Theme Toggle
function initializeTheme() {
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");

    if (isDark) {
      themeIcon.innerHTML =
        '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
    } else {
      themeIcon.innerHTML = `
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      `;
    }
  });
}

// Render flood reports
function renderFloodReports() {
  const reportsGrid = document.getElementById("reportsGrid");

  floodReports.forEach((report) => {
    const card = createReportCard(report);
    reportsGrid.appendChild(card);
  });
}

// Create report card element
function createReportCard(report) {
  const card = document.createElement("article");
  card.className = "report-card";

  const statusClass = `status-${report.status}`;
  const statusText =
    report.status.charAt(0).toUpperCase() + report.status.slice(1);

  card.innerHTML = `
    <div class="report-image">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
      </svg>
    </div>
    <div class="report-content">
      <div class="report-header">
        <span class="report-status ${statusClass}">${statusText}</span>
      </div>
      <p class="report-description">${report.description}</p>
      <div class="report-meta">
        <div class="meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>${report.location}</span>
        </div>
        <div class="meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>${report.timestamp}</span>
        </div>
      </div>
    </div>
  `;

  return card;
}

// Initialize event listeners
function initializeEventListeners() {
  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const sidebarLeft = document.getElementById("sidebarLeft");

  mobileMenuBtn.addEventListener("click", () => {
    sidebarLeft.classList.toggle("active");
  });

  // Close sidebar when clicking outside on mobile
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 968) {
      if (
        !sidebarLeft.contains(e.target) &&
        !mobileMenuBtn.contains(e.target)
      ) {
        sidebarLeft.classList.remove("active");
      }
    }
  });

  // Profile dropdown toggle
  const profileBtn = document.getElementById("profileBtn");
  const profileDropdown = document.getElementById("profileDropdown");

  profileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle("active");

    // Close notification dropdown if open
    const notificationDropdown = document.getElementById(
      "notificationDropdown"
    );
    notificationDropdown.classList.remove("active");
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!profileDropdown.contains(e.target) && !profileBtn.contains(e.target)) {
      profileDropdown.classList.remove("active");
    }
  });

  // Logout button
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.addEventListener("click", () => {
    alert("Logout functionality would be implemented here!");
  });

  // Navigation links
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const page = link.getAttribute("data-page");

      // Allow navigation for links with href to actual pages
      if (
        link.hasAttribute("href") &&
        link.getAttribute("href").endsWith(".html")
      ) {
        // Don't prevent default - let the browser navigate
        // Just close mobile menu
        if (window.innerWidth <= 968) {
          sidebarLeft.classList.remove("active");
        }
        return; // Exit early, allow default navigation
      }

      // For non-page links (like #), prevent default
      e.preventDefault();

      // Remove active class from all links
      navLinks.forEach((l) => l.classList.remove("active"));

      // Add active class to clicked link
      link.classList.add("active");

      // Close mobile menu
      if (window.innerWidth <= 968) {
        sidebarLeft.classList.remove("active");
      }

      console.log(`Navigating to: ${page}`);
      // Here you would implement actual page navigation or content switching
    });
  });

  // Search functionality
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    filterReports(searchTerm);
  });

  // Notification dropdown toggle
  const notificationBtn = document.getElementById("notificationBtn");
  const notificationDropdown = document.getElementById("notificationDropdown");
  const navbar = document.querySelector(".navbar");

  notificationBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    // Check if mobile (480px or below)
    const isMobile = window.innerWidth <= 480;

    if (isMobile) {
      // Fullscreen overlay mode
      navbar.classList.add("overlay-active", "notification-overlay");
      document.body.classList.add("overlay-open");
      notificationDropdown.classList.add("active");
    } else {
      const isActive = notificationDropdown.classList.toggle("active");

      // Prevent body scroll on tablet when notification is open
      if (window.innerWidth <= 968) {
        if (isActive) {
          document.body.classList.add("notification-open");
        } else {
          document.body.classList.remove("notification-open");
        }
      }
    }

    // Close profile dropdown if open
    const profileDropdown = document.getElementById("profileDropdown");
    profileDropdown.classList.remove("active");
  });

  // Close notification dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !notificationDropdown.contains(e.target) &&
      !notificationBtn.contains(e.target)
    ) {
      // Check if in overlay mode (mobile)
      if (navbar.classList.contains("notification-overlay")) {
        return; // Don't close when clicking inside in overlay mode
      } else {
        notificationDropdown.classList.remove("active");
        document.body.classList.remove("notification-open");
      }
    }
  });

  // Close notification on back button (mobile)
  const notificationBackBtn = document.getElementById("notificationBackBtn");
  if (notificationBackBtn) {
    notificationBackBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeNotificationOverlay();
    });
  }

  // Individual notification click
  const notificationItems = document.querySelectorAll(".notification-item");
  notificationItems.forEach((item) => {
    item.addEventListener("click", () => {
      item.classList.remove("unread");
      // Here you could navigate to specific notification details
    });
  });
}

/**
 * Close notification overlay
 */
function closeNotificationOverlay() {
  const navbar = document.querySelector(".navbar");
  const notificationDropdown = document.getElementById("notificationDropdown");

  navbar.classList.remove("overlay-active", "notification-overlay");
  notificationDropdown.classList.remove("active");
  document.body.classList.remove("overlay-open", "notification-open");
}

// Initialize responsive search toggle
function initializeResponsiveSearch() {
  const searchToggleBtn = document.getElementById("searchToggleBtn");
  const searchBar = document.getElementById("searchBar");
  const searchCloseBtn = document.getElementById("searchCloseBtn");
  const searchInput = document.getElementById("searchInput");
  const navbar = document.querySelector(".navbar");

  // Open search
  searchToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openMobileSearch();
  });

  // Close search
  searchCloseBtn.addEventListener("click", () => {
    closeMobileSearch();
  });

  // Close search when clicking outside
  document.addEventListener("click", (e) => {
    if (
      window.innerWidth <= 968 &&
      searchBar.classList.contains("mobile-expanded") &&
      !searchBar.contains(e.target) &&
      !searchToggleBtn.contains(e.target)
    ) {
      closeMobileSearch();
    }
  });

  // Close search on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchBar.classList.contains("mobile-expanded")) {
      closeMobileSearch();
    }
  });

  // Handle window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 968) {
      closeMobileSearch();
    }
  });

  function openMobileSearch() {
    searchBar.classList.add("mobile-expanded");
    navbar.classList.add("search-active");
    searchInput.focus();
  }

  function closeMobileSearch() {
    searchBar.classList.remove("mobile-expanded");
    navbar.classList.remove("search-active");
    searchInput.value = "";
    // Reset search results
    filterReports("");
  }
}

// Filter reports based on search
function filterReports(searchTerm) {
  const reportCards = document.querySelectorAll(".report-card");

  reportCards.forEach((card) => {
    const description = card
      .querySelector(".report-description")
      .textContent.toLowerCase();
    const location = card
      .querySelector(".meta-item span")
      .textContent.toLowerCase();

    if (description.includes(searchTerm) || location.includes(searchTerm)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// Safety tips carousel
function initializeSafetyTipsCarousel() {
  const tips = document.querySelectorAll(".tip-content");
  const dots = document.querySelectorAll(".dot");
  let currentTip = 0;

  // Auto-rotate tips every 5 seconds
  setInterval(() => {
    currentTip = (currentTip + 1) % tips.length;
    showTip(currentTip);
  }, 5000);

  // Dot click handlers
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentTip = index;
      showTip(currentTip);
    });
  });

  function showTip(index) {
    // Hide all tips
    tips.forEach((tip) => tip.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    // Show selected tip
    tips[index].classList.add("active");
    dots[index].classList.add("active");
  }
}

// Handle window resize
window.addEventListener("resize", () => {
  const sidebarLeft = document.getElementById("sidebarLeft");
  const navbar = document.querySelector(".navbar");

  // Close mobile menu when resizing to desktop
  if (window.innerWidth > 968) {
    sidebarLeft.classList.remove("active");
  }

  // If resized above 480px while overlay is open, close it
  if (
    window.innerWidth > 480 &&
    navbar.classList.contains("notification-overlay")
  ) {
    closeNotificationOverlay();
  }
});
