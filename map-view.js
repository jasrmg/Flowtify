// Mock flood reports data (simulating backend API)
const mockFloodReports = [
  {
    id: 1,
    lat: 10.3157,
    lng: 123.8854,
    location: "Barangay Lahug, Gorordo Ave",
    description:
      "Severe flooding at intersection. Water level approximately 2 feet high. Road impassable for small vehicles.",
    status: "verified",
    timestamp: "2 hours ago",
    imageUrl: null,
  },
  {
    id: 2,
    lat: 10.3268,
    lng: 123.8931,
    location: "Barangay Mabolo, Mango Ave",
    description:
      "Minor flooding reported near plaza. Pedestrian walkways affected. Situation under monitoring.",
    status: "pending",
    timestamp: "4 hours ago",
    imageUrl: null,
  },
  {
    id: 3,
    lat: 10.3113,
    lng: 123.8935,
    location: "Barangay Capitol Site",
    description:
      "Flooding has subsided. Roads are now clear and passable. Cleanup operations ongoing.",
    status: "resolved",
    timestamp: "6 hours ago",
    imageUrl: null,
  },
  {
    id: 4,
    lat: 10.2971,
    lng: 123.882,
    location: "Barangay Guadalupe, N. Bacalso Ave",
    description:
      "Flash flooding reported due to heavy rainfall. Multiple areas affected. Avoid unnecessary travel.",
    status: "verified",
    timestamp: "1 hour ago",
    imageUrl: null,
  },
  {
    id: 5,
    lat: 10.3195,
    lng: 123.9013,
    location: "Barangay Kamputhaw",
    description:
      "Street flooding in low-lying areas. Water level rising. Residents advised to stay alert.",
    status: "verified",
    timestamp: "3 hours ago",
    imageUrl: null,
  },
  {
    id: 6,
    lat: 10.3241,
    lng: 123.9062,
    location: "Barangay Kasambagan",
    description:
      "Water accumulation near drainage areas. Monitoring ongoing for potential overflow.",
    status: "pending",
    timestamp: "5 hours ago",
    imageUrl: null,
  },
  {
    id: 7,
    lat: 10.3093,
    lng: 123.8981,
    location: "Barangay Apas, Cardinal Rosales Ave",
    description:
      "Heavy flooding blocking main road. Emergency vehicles rerouted. Exercise extreme caution.",
    status: "verified",
    timestamp: "30 minutes ago",
    imageUrl: null,
  },
  {
    id: 8,
    lat: 10.3344,
    lng: 123.9176,
    location: "Barangay Banilad, Talamban Road",
    description:
      "Moderate flooding in residential areas. Water receding slowly. Stay indoors if possible.",
    status: "pending",
    timestamp: "2.5 hours ago",
    imageUrl: null,
  },
];

// Global variables
let map;
let markers = [];
let markerClusterGroup;
let allReports = [];
let filteredReports = [];

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  initializeTheme();
  initializeMap();
  initializeEventListeners();
  loadFloodReports();
});

/**
 * Initialize theme toggle functionality
 */
function initializeTheme() {
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");

  // Load saved theme preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    updateThemeIcon(themeIcon, true);
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");

    // Save preference
    localStorage.setItem("theme", isDark ? "dark" : "light");

    updateThemeIcon(themeIcon, isDark);
  });
}

/**
 * Update theme icon based on mode
 */
function updateThemeIcon(iconElement, isDark) {
  if (isDark) {
    iconElement.innerHTML =
      '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
  } else {
    iconElement.innerHTML = `
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
}

/**
 * Initialize Leaflet map
 */
function initializeMap() {
  // Default center: Cebu City
  const defaultCenter = [10.3157, 123.8854];
  const defaultZoom = 13;

  // Create map
  map = L.map("map").setView(defaultCenter, defaultZoom);

  // Add tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);

  // Initialize marker cluster group
  markerClusterGroup = L.markerClusterGroup({
    maxClusterRadius: 50,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
  });

  map.addLayer(markerClusterGroup);

  // Try to get user's location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        // Check if user is near Cebu City (within reasonable distance)
        const cebuLat = 10.3157;
        const cebuLng = 123.8854;
        const distance = getDistance(userLat, userLng, cebuLat, cebuLng);

        // If within 50km of Cebu City, center on user location
        if (distance < 50) {
          map.setView([userLat, userLng], defaultZoom);

          // Add user location marker
          L.marker([userLat, userLng], {
            icon: L.divIcon({
              className: "user-location-marker",
              html: '<div style="background-color: #3FA9F5; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
              iconSize: [16, 16],
            }),
          })
            .addTo(map)
            .bindPopup("Your Location");
        }
      },
      (error) => {
        console.log("Geolocation error:", error.message);
      }
    );
  }
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Load flood reports from mock API
 */
async function loadFloodReports() {
  const loadingIndicator = document.getElementById("mapLoading");

  try {
    // Show loading indicator
    loadingIndicator.classList.remove("hidden");

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In production, this would be: const response = await fetch('/api/flood-reports');
    // const data = await response.json();

    allReports = [...mockFloodReports];
    filteredReports = [...allReports];

    // Render markers on map
    renderMarkers(filteredReports);
  } catch (error) {
    console.error("Error loading flood reports:", error);
    alert("Failed to load flood reports. Please try again.");
  } finally {
    // Hide loading indicator
    loadingIndicator.classList.add("hidden");
  }
}

/**
 * Render markers on the map
 */
function renderMarkers(reports) {
  // Clear existing markers
  markerClusterGroup.clearLayers();
  markers = [];

  // Create markers for each report
  reports.forEach((report) => {
    const marker = createMarker(report);
    markers.push(marker);
    markerClusterGroup.addLayer(marker);
  });
}

/**
 * Create a marker for a flood report
 */
function createMarker(report) {
  // Determine marker color based on status
  const markerColor = getMarkerColor(report.status);

  // Create custom icon
  const customIcon = L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color: ${markerColor}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  // Create marker
  const marker = L.marker([report.lat, report.lng], { icon: customIcon });

  // Create popup content
  const popupContent = createPopupContent(report);

  // Bind popup
  marker.bindPopup(popupContent, {
    maxWidth: 280,
    className: "custom-popup",
  });

  return marker;
}

/**
 * Get marker color based on status
 */
function getMarkerColor(status) {
  switch (status) {
    case "verified":
      return "#d14343"; // Red
    case "pending":
      return "#f59e0b"; // Orange
    case "resolved":
      return "#10b981"; // Green
    default:
      return "#6b7280"; // Gray
  }
}

/**
 * Create popup content HTML
 */
function createPopupContent(report) {
  const statusClass = report.status;
  const statusText =
    report.status.charAt(0).toUpperCase() + report.status.slice(1);

  return `
    <div class="popup-container">
      <div class="popup-image">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
        </svg>
      </div>
      <div class="popup-content">
        <div class="popup-header">
          <div class="popup-location">${report.location}</div>
          <span class="popup-status ${statusClass}">${statusText}</span>
        </div>
        <p class="popup-description">${report.description}</p>
        <div class="popup-time">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          ${report.timestamp}
        </div>
        <button class="popup-button" onclick="viewFullReport(${report.id})">
          View Full Report
        </button>
      </div>
    </div>
  `;
}

/**
 * View full report (placeholder function)
 */
function viewFullReport(reportId) {
  console.log("Viewing report:", reportId);
  alert(`Full report view for Report #${reportId} would open here.`);
  // In production, this would navigate to a detailed report page
}

/**
 * Initialize all event listeners
 */
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
      // Allow actual navigation for home link
      const page = link.getAttribute("data-page");
      if (page === "home") {
        return; // Allow default navigation
      }

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
    });
  });

  // Top navbar search functionality
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      filterReportsBySearch(searchTerm);
    });
  }

  // Map search functionality
  const mapSearchInput = document.getElementById("mapSearchInput");
  mapSearchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    filterReportsBySearch(searchTerm);
  });

  // Status filter
  const statusFilter = document.getElementById("statusFilter");
  statusFilter.addEventListener("change", (e) => {
    applyFilters();
  });

  // Refresh button
  const refreshBtn = document.getElementById("refreshBtn");
  refreshBtn.addEventListener("click", async () => {
    refreshBtn.classList.add("spinning");
    await loadFloodReports();

    // Reset filters
    statusFilter.value = "all";
    mapSearchInput.value = "";

    setTimeout(() => {
      refreshBtn.classList.remove("spinning");
    }, 500);
  });

  // Legend toggle
  const legendBtn = document.getElementById("legendBtn");
  const legendDrawer = document.getElementById("legendDrawer");
  const legendClose = document.getElementById("legendClose");

  legendBtn.addEventListener("click", () => {
    legendDrawer.classList.toggle("active");
  });

  legendClose.addEventListener("click", () => {
    legendDrawer.classList.remove("active");
  });

  // Close legend when clicking outside
  document.addEventListener("click", (e) => {
    if (!legendDrawer.contains(e.target) && !legendBtn.contains(e.target)) {
      legendDrawer.classList.remove("active");
    }
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

      // Prevent body scroll on mobile when notification is open
      if (window.innerWidth <= 968) {
        if (isActive) {
          document.body.classList.add("notification-open");
        } else {
          document.body.classList.remove("notification-open");
        }
      }
    }

    // Close profile dropdown if open
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
        return;
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
    });
  });

  // Initialize responsive search toggle
  initializeResponsiveSearch();

  // Handle window resize
  window.addEventListener("resize", () => {
    // Close mobile menu when resizing to desktop
    if (window.innerWidth > 968) {
      sidebarLeft.classList.remove("active");
    }

    // Invalidate map size on resize
    if (map) {
      setTimeout(() => {
        map.invalidateSize();
      }, 400);
    }

    // If resized above 480px while overlay is open, close it
    if (
      window.innerWidth > 480 &&
      navbar.classList.contains("notification-overlay")
    ) {
      closeNotificationOverlay();
    }
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

/**
 * Initialize responsive search toggle
 */
function initializeResponsiveSearch() {
  const searchToggleBtn = document.getElementById("searchToggleBtn");
  const searchBar = document.getElementById("searchBar");
  const searchCloseBtn = document.getElementById("searchCloseBtn");
  const searchInput = document.getElementById("searchInput");
  const navbar = document.querySelector(".navbar");

  if (!searchToggleBtn) return;

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

  function openMobileSearch() {
    searchBar.classList.add("mobile-expanded");
    navbar.classList.add("search-active");
    searchInput.focus();
  }

  function closeMobileSearch() {
    searchBar.classList.remove("mobile-expanded");
    navbar.classList.remove("search-active");
    searchInput.value = "";
  }
}

/**
 * Filter reports by search term
 */
function filterReportsBySearch(searchTerm) {
  applyFilters(searchTerm);
}

/**
 * Apply all active filters
 */
function applyFilters(searchOverride = null) {
  const statusFilter = document.getElementById("statusFilter").value;
  const mapSearchInput = document.getElementById("mapSearchInput");
  const searchTerm =
    searchOverride !== null
      ? searchOverride
      : mapSearchInput.value.toLowerCase();

  // Start with all reports
  let filtered = [...allReports];

  // Apply status filter
  if (statusFilter !== "all") {
    filtered = filtered.filter((report) => report.status === statusFilter);
  }

  // Apply search filter
  if (searchTerm) {
    filtered = filtered.filter(
      (report) =>
        report.location.toLowerCase().includes(searchTerm) ||
        report.description.toLowerCase().includes(searchTerm)
    );
  }

  // Update filtered reports and render
  filteredReports = filtered;
  renderMarkers(filteredReports);

  // Fit map bounds to show all filtered markers
  if (filteredReports.length > 0) {
    const bounds = L.latLngBounds(filteredReports.map((r) => [r.lat, r.lng]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
  }
}

// Make viewFullReport available globally
window.viewFullReport = viewFullReport;
