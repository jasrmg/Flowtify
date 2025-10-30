// Sample data
const pendingReports = [
  {
    id: 1,
    reporter: "Juan Dela Cruz",
    location: "Barangay Lahug, Gorordo Ave",
    description:
      "Severe flooding on main road, water level approximately 2 feet high. Multiple vehicles stranded.",
    date: "2024-10-30 14:30",
    photo:
      "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&h=600&fit=crop",
  },
  {
    id: 2,
    reporter: "Maria Santos",
    location: "Barangay Mabolo, Mango Square",
    description:
      "Flash flood in commercial area. Water accumulating rapidly near drainage systems.",
    date: "2024-10-30 13:15",
    photo:
      "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800&h=600&fit=crop",
  },
  {
    id: 3,
    reporter: "Pedro Garcia",
    location: "Barangay Capitol Site",
    description:
      "Heavy rain causing street flooding. Pedestrian walkways submerged.",
    date: "2024-10-30 12:00",
    photo:
      "https://images.unsplash.com/photo-1589820296156-2454bb98a4ba?w=800&h=600&fit=crop",
  },
  {
    id: 4,
    reporter: "Ana Rodriguez",
    location: "Barangay Guadalupe",
    description:
      "Flood water entering residential homes. Residents requesting evacuation assistance.",
    date: "2024-10-30 11:45",
    photo:
      "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=600&fit=crop",
  },
  {
    id: 5,
    reporter: "Carlos Mendoza",
    location: "Barangay Kamputhaw",
    description:
      "Major road closure due to flooding. Traffic being diverted to alternative routes.",
    date: "2024-10-30 10:20",
    photo:
      "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&h=600&fit=crop",
  },
];

const mapMarkers = [
  {
    id: 1,
    lat: 10.3157,
    lng: 123.8854,
    location: "Barangay Lahug",
    description:
      "Severe flooding on main road, water level approximately 2 feet high.",
    fullDescription:
      "Severe flooding reported on Gorordo Avenue in Barangay Lahug. Water level has reached approximately 2 feet, causing multiple vehicles to become stranded. Local authorities are working on clearing the drainage system. Residents are advised to avoid the area and use alternative routes.",
  },
  {
    id: 2,
    lat: 10.3208,
    lng: 123.901,
    location: "Barangay Mabolo",
    description: "Flash flood in commercial area near Mango Square.",
    fullDescription:
      "Flash flooding occurring in the commercial district of Barangay Mabolo, particularly around Mango Square. Water is accumulating rapidly near drainage systems. Business operations have been temporarily suspended. Emergency response teams are on site.",
  },
  {
    id: 3,
    lat: 10.3105,
    lng: 123.892,
    location: "Barangay Capitol Site",
    description: "Street flooding affecting pedestrian walkways.",
    fullDescription:
      "Heavy rainfall has caused significant street flooding in Barangay Capitol Site. Pedestrian walkways are currently submerged. The Capitol building area is experiencing water accumulation. Maintenance crews are working to restore normal conditions.",
  },
  {
    id: 4,
    lat: 10.2944,
    lng: 123.8753,
    location: "Barangay Guadalupe",
    description: "Flood water entering residential homes.",
    fullDescription:
      "Critical flooding situation in residential areas of Barangay Guadalupe. Water has begun entering ground-floor homes. Several families have requested evacuation assistance. Emergency shelters have been prepared. Relief operations are underway.",
  },
  {
    id: 5,
    lat: 10.305,
    lng: 123.896,
    location: "Barangay Kamputhaw",
    description: "Major road closure due to flooding.",
    fullDescription:
      "Significant road closure implemented in Barangay Kamputhaw due to severe flooding conditions. Main thoroughfares are impassable. Traffic is being diverted to alternative routes. Expected clearance time is 3-4 hours pending weather improvement.",
  },
];

const activeAlerts = [
  {
    id: 1,
    title: "Severe Flooding Warning",
    location: "Barangay Lahug, Gorordo Ave",
    severity: "high",
    time: "Active now",
  },
  {
    id: 2,
    title: "Heavy Rainfall Advisory",
    location: "Metro Cebu Area",
    severity: "medium",
    time: "Active now",
  },
  {
    id: 3,
    title: "Road Closure Notice",
    location: "Barangay Mabolo",
    severity: "low",
    time: "Active for 2 hours",
  },
  {
    id: 4,
    title: "Evacuation Advisory",
    location: "Barangay Guadalupe",
    severity: "high",
    time: "Active now",
  },
];

const emergencyHotlines = [
  {
    id: 1,
    name: "Cebu City Disaster Risk Reduction",
    number: "(032) 123-4567",
    description: "24/7 emergency response and disaster management",
  },
  {
    id: 2,
    name: "Philippine Red Cross - Cebu",
    number: "(032) 234-5678",
    description: "Emergency medical assistance and relief operations",
  },
  {
    id: 3,
    name: "Bureau of Fire Protection",
    number: "(032) 345-6789",
    description: "Fire emergency and rescue operations",
  },
  {
    id: 4,
    name: "Philippine National Police",
    number: "(032) 456-7890",
    description: "Police assistance and emergency response",
  },
];

const systemLogs = [
  {
    id: 1,
    type: "info",
    message: "User authentication successful for admin@flowtify.com",
    time: "5 minutes ago",
  },
  {
    id: 2,
    type: "success",
    message: "Database backup completed successfully",
    time: "15 minutes ago",
  },
  {
    id: 3,
    type: "warning",
    message: "High server load detected - monitoring",
    time: "30 minutes ago",
  },
  {
    id: 4,
    type: "info",
    message: "15 new user registrations processed",
    time: "1 hour ago",
  },
  {
    id: 5,
    type: "success",
    message: "System update deployed successfully",
    time: "2 hours ago",
  },
  {
    id: 6,
    type: "info",
    message: "3 flood reports verified and published",
    time: "2 hours ago",
  },
];

const monthlyReportData = [
  { month: "Jan", value: 85 },
  { month: "Feb", value: 120 },
  { month: "Mar", value: 95 },
  { month: "Apr", value: 140 },
  { month: "May", value: 180 },
  { month: "Jun", value: 160 },
  { month: "Jul", value: 200 },
  { month: "Aug", value: 175 },
  { month: "Sep", value: 190 },
  { month: "Oct", value: 220 },
];

let map;
let currentReportId = null;

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  initializeTheme();
  initializeNavigation();
  renderReportsTable();
  renderActiveAlerts();
  renderEmergencyHotlines();
  renderSystemLogs();
  renderMonthlyChart();
  initializeEventListeners();
  initializeSearch();
  initializeModals();

  // Initialize map when map section is shown
  const mapSection = document.getElementById("mapSection");
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.classList.contains("active") && !map) {
        initializeMap();
      }
    });
  });
  observer.observe(mapSection, {
    attributes: true,
    attributeFilter: ["class"],
  });
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

// Navigation between sections
function initializeNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".content-section");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const sectionId = link.getAttribute("data-section");

      // Update active nav link
      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      // Show corresponding section
      sections.forEach((section) => {
        if (section.id === sectionId + "Section") {
          section.classList.add("active");
        } else {
          section.classList.remove("active");
        }
      });

      // Close mobile sidebar
      if (window.innerWidth <= 968) {
        document.getElementById("sidebarLeft").classList.remove("active");
      }

      // Initialize map if navigating to map section
      if (sectionId === "map" && !map) {
        setTimeout(initializeMap, 100);
      }
    });
  });
}

// Initialize Leaflet Map
function initializeMap() {
  if (map) return;

  map = L.map("map").setView([10.3157, 123.8854], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Add markers
  mapMarkers.forEach((marker) => {
    const circle = L.circle([marker.lat, marker.lng], {
      color: "#ff6b6b",
      fillColor: "#ff6b6b",
      fillOpacity: 0.5,
      radius: 300,
    }).addTo(map);

    const popupContent = `
      <div class="map-popup-content">
        <h3>${marker.location}</h3>
        <p>${marker.description}</p>
        <button class="map-popup-btn" onclick="showMapDescription(${marker.id})">View Full Description</button>
      </div>
    `;

    circle.bindPopup(popupContent);
  });
}

// Show map description modal
window.showMapDescription = function (markerId) {
  const marker = mapMarkers.find((m) => m.id === markerId);
  if (!marker) return;

  document.getElementById("mapDescModalTitle").textContent = marker.location;
  document.getElementById("mapDescModalLocation").textContent = marker.location;
  document.getElementById("mapDescModalDescription").textContent =
    marker.fullDescription;

  document.getElementById("mapDescModal").classList.add("active");
};

// Render Reports Table
function renderReportsTable() {
  const tbody = document.getElementById("reportsTableBody");
  tbody.innerHTML = "";

  pendingReports.forEach((report) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${report.reporter}</td>
      <td>${report.location}</td>
      <td>${report.description.substring(0, 50)}...</td>
      <td>${report.date}</td>
      <td><button class="action-btn" onclick="viewReportDetails(${
        report.id
      })">View Details</button></td>
    `;

    tbody.appendChild(row);
  });
}

// View report details
window.viewReportDetails = function (reportId) {
  const report = pendingReports.find((r) => r.id === reportId);
  if (!report) return;

  currentReportId = reportId;

  document.getElementById("reportModalTitle").textContent =
    "Report #" + reportId;
  document.getElementById("reportModalReporter").textContent = report.reporter;
  document.getElementById("reportModalLocation").textContent = report.location;
  document.getElementById("reportModalDescription").textContent =
    report.description;
  document.getElementById("reportModalDate").textContent = report.date;
  document.getElementById("reportModalPhoto").querySelector("img").src =
    report.photo;

  document.getElementById("reportModal").classList.add("active");
};

// Render Active Alerts
function renderActiveAlerts() {
  const alertsGrid = document.getElementById("alertsGrid");
  alertsGrid.innerHTML = "";

  activeAlerts.forEach((alert) => {
    const alertCard = document.createElement("div");
    alertCard.className = `alert-card severity-${alert.severity}`;

    alertCard.innerHTML = `
      <div class="alert-header">
        <span class="severity-badge severity-${alert.severity}">${
      alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)
    }</span>
      </div>
      <h3 class="alert-title">${alert.title}</h3>
      <div class="alert-location">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        ${alert.location}
      </div>
      <div class="alert-time">${alert.time}</div>
    `;

    alertsGrid.appendChild(alertCard);
  });
}

// Render Emergency Hotlines
function renderEmergencyHotlines() {
  const hotlinesGrid = document.getElementById("hotlinesGrid");
  hotlinesGrid.innerHTML = "";

  emergencyHotlines.forEach((hotline) => {
    const hotlineCard = document.createElement("div");
    hotlineCard.className = "hotline-card";

    hotlineCard.innerHTML = `
      <div class="hotline-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
      </div>
      <h3 class="hotline-name">${hotline.name}</h3>
      <div class="hotline-number">${hotline.number}</div>
      <p class="hotline-description">${hotline.description}</p>
    `;

    hotlinesGrid.appendChild(hotlineCard);
  });
}

// Render System Logs
function renderSystemLogs() {
  const logList = document.getElementById("logList");
  logList.innerHTML = "";

  systemLogs.forEach((log) => {
    const logItem = document.createElement("div");
    logItem.className = "log-item";

    const iconSVG = getLogIcon(log.type);

    logItem.innerHTML = `
      <div class="log-icon ${log.type}">
        ${iconSVG}
      </div>
      <div class="log-content">
        <div class="log-message">${log.message}</div>
        <div class="log-time">${log.time}</div>
      </div>
    `;

    logList.appendChild(logItem);
  });
}

// Get log icon based on type
function getLogIcon(type) {
  const icons = {
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
    success:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
    warning:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
    error:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
  };
  return icons[type] || icons.info;
}

// Render Monthly Chart
function renderMonthlyChart() {
  const chartContainer = document.getElementById("reportChart");
  chartContainer.innerHTML = "";

  const maxValue = Math.max(...monthlyReportData.map((d) => d.value));

  monthlyReportData.forEach((data) => {
    const bar = document.createElement("div");
    bar.className = "chart-bar";
    const heightPercentage = (data.value / maxValue) * 100;
    bar.style.height = `${heightPercentage}%`;

    bar.innerHTML = `
      <div class="chart-bar-value">${data.value}</div>
      <div class="chart-bar-label">${data.month}</div>
    `;

    chartContainer.appendChild(bar);
  });
}

// Initialize Event Listeners
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

    const notificationDropdown = document.getElementById(
      "notificationDropdown"
    );
    notificationDropdown.classList.remove("active");
  });

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

  // Notification dropdown toggle
  const notificationBtn = document.getElementById("notificationBtn");
  const notificationDropdown = document.getElementById("notificationDropdown");
  const navbar = document.querySelector(".navbar");

  notificationBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    const isMobile = window.innerWidth <= 480;

    if (isMobile) {
      navbar.classList.add("overlay-active", "notification-overlay");
      document.body.classList.add("overlay-open");
      notificationDropdown.classList.add("active");
    } else {
      const isActive = notificationDropdown.classList.toggle("active");

      if (window.innerWidth <= 968) {
        if (isActive) {
          document.body.classList.add("notification-open");
        } else {
          document.body.classList.remove("notification-open");
        }
      }
    }

    profileDropdown.classList.remove("active");
  });

  document.addEventListener("click", (e) => {
    if (
      !notificationDropdown.contains(e.target) &&
      !notificationBtn.contains(e.target)
    ) {
      if (navbar.classList.contains("notification-overlay")) {
        return;
      } else {
        notificationDropdown.classList.remove("active");
        document.body.classList.remove("notification-open");
      }
    }
  });

  const notificationBackBtn = document.getElementById("notificationBackBtn");
  if (notificationBackBtn) {
    notificationBackBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeNotificationOverlay();
    });
  }

  const notificationItems = document.querySelectorAll(".notification-item");
  notificationItems.forEach((item) => {
    item.addEventListener("click", () => {
      item.classList.remove("unread");
    });
  });
}

// Close notification overlay
function closeNotificationOverlay() {
  const navbar = document.querySelector(".navbar");
  const notificationDropdown = document.getElementById("notificationDropdown");

  navbar.classList.remove("overlay-active", "notification-overlay");
  notificationDropdown.classList.remove("active");
  document.body.classList.remove("overlay-open", "notification-open");
}

// Initialize search functionality
function initializeSearch() {
  const searchToggleBtn = document.getElementById("searchToggleBtn");
  const searchBar = document.getElementById("searchBar");
  const searchCloseBtn = document.getElementById("searchCloseBtn");
  const searchInput = document.getElementById("searchInput");
  const navbar = document.querySelector(".navbar");

  searchToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openMobileSearch();
  });

  searchCloseBtn.addEventListener("click", () => {
    closeMobileSearch();
  });

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

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchBar.classList.contains("mobile-expanded")) {
      closeMobileSearch();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 968) {
      closeMobileSearch();
    }
  });

  // Search functionality
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (query.length > 0) {
      performSearch(query);
    }
  });

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const query = e.target.value.toLowerCase().trim();
      if (query.length > 0) {
        performSearch(query);
      }
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

// Perform search and scroll to matching section
function performSearch(query) {
  const navLinks = document.querySelectorAll(".nav-link");
  let matchFound = false;

  navLinks.forEach((link) => {
    const sectionName = link.querySelector("span").textContent.toLowerCase();
    const sectionId = link.getAttribute("data-section");

    if (sectionName.includes(query)) {
      if (!matchFound) {
        link.click();
        matchFound = true;
      }
    }
  });

  if (!matchFound) {
    console.log("No matching section found for:", query);
  }
}

// Initialize Modals
function initializeModals() {
  // Report Modal
  const reportModal = document.getElementById("reportModal");
  const reportModalClose = document.getElementById("reportModalClose");
  const reportModalOverlay = document.getElementById("reportModalOverlay");
  const approveBtn = document.getElementById("approveReportBtn");
  const rejectBtn = document.getElementById("rejectReportBtn");

  reportModalClose.addEventListener("click", () => {
    reportModal.classList.remove("active");
  });

  reportModalOverlay.addEventListener("click", () => {
    reportModal.classList.remove("active");
  });

  approveBtn.addEventListener("click", () => {
    if (currentReportId) {
      alert(`Report #${currentReportId} approved!`);
      reportModal.classList.remove("active");
      // Remove from pending reports
      const index = pendingReports.findIndex((r) => r.id === currentReportId);
      if (index > -1) {
        pendingReports.splice(index, 1);
        renderReportsTable();
      }
    }
  });

  rejectBtn.addEventListener("click", () => {
    if (currentReportId) {
      alert(`Report #${currentReportId} rejected!`);
      reportModal.classList.remove("active");
      // Remove from pending reports
      const index = pendingReports.findIndex((r) => r.id === currentReportId);
      if (index > -1) {
        pendingReports.splice(index, 1);
        renderReportsTable();
      }
    }
  });

  // Alert Modal
  const alertModal = document.getElementById("alertModal");
  const addAlertBtn = document.getElementById("addAlertBtn");
  const alertModalClose = document.getElementById("alertModalClose");
  const alertModalOverlay = document.getElementById("alertModalOverlay");
  const submitAlertBtn = document.getElementById("submitAlertBtn");
  const cancelAlertBtn = document.getElementById("cancelAlertBtn");

  addAlertBtn.addEventListener("click", () => {
    alertModal.classList.add("active");
  });

  alertModalClose.addEventListener("click", () => {
    alertModal.classList.remove("active");
  });

  alertModalOverlay.addEventListener("click", () => {
    alertModal.classList.remove("active");
  });

  cancelAlertBtn.addEventListener("click", () => {
    alertModal.classList.remove("active");
  });

  submitAlertBtn.addEventListener("click", () => {
    const title = document.getElementById("alertTitle").value;
    const location = document.getElementById("alertLocation").value;
    const severity = document.getElementById("alertSeverity").value;
    const message = document.getElementById("alertMessage").value;

    if (title && location && message) {
      activeAlerts.push({
        id: activeAlerts.length + 1,
        title: title,
        location: location,
        severity: severity,
        time: "Active now",
      });

      renderActiveAlerts();
      alertModal.classList.remove("active");

      // Clear form
      document.getElementById("alertTitle").value = "";
      document.getElementById("alertLocation").value = "";
      document.getElementById("alertSeverity").value = "low";
      document.getElementById("alertMessage").value = "";

      alert("Alert created successfully!");
    } else {
      alert("Please fill in all fields!");
    }
  });

  // Hotline Modal
  const hotlineModal = document.getElementById("hotlineModal");
  const addHotlineBtn = document.getElementById("addHotlineBtn");
  const hotlineModalClose = document.getElementById("hotlineModalClose");
  const hotlineModalOverlay = document.getElementById("hotlineModalOverlay");
  const submitHotlineBtn = document.getElementById("submitHotlineBtn");
  const cancelHotlineBtn = document.getElementById("cancelHotlineBtn");

  addHotlineBtn.addEventListener("click", () => {
    hotlineModal.classList.add("active");
  });

  hotlineModalClose.addEventListener("click", () => {
    hotlineModal.classList.remove("active");
  });

  hotlineModalOverlay.addEventListener("click", () => {
    hotlineModal.classList.remove("active");
  });

  cancelHotlineBtn.addEventListener("click", () => {
    hotlineModal.classList.remove("active");
  });

  submitHotlineBtn.addEventListener("click", () => {
    const name = document.getElementById("hotlineName").value;
    const number = document.getElementById("hotlineNumber").value;
    const description = document.getElementById("hotlineDescription").value;

    if (name && number && description) {
      emergencyHotlines.push({
        id: emergencyHotlines.length + 1,
        name: name,
        number: number,
        description: description,
      });

      renderEmergencyHotlines();
      hotlineModal.classList.remove("active");

      // Clear form
      document.getElementById("hotlineName").value = "";
      document.getElementById("hotlineNumber").value = "";
      document.getElementById("hotlineDescription").value = "";

      alert("Emergency hotline added successfully!");
    } else {
      alert("Please fill in all fields!");
    }
  });

  // Map Description Modal
  const mapDescModal = document.getElementById("mapDescModal");
  const mapDescModalClose = document.getElementById("mapDescModalClose");
  const mapDescModalOverlay = document.getElementById("mapDescModalOverlay");

  mapDescModalClose.addEventListener("click", () => {
    mapDescModal.classList.remove("active");
  });

  mapDescModalOverlay.addEventListener("click", () => {
    mapDescModal.classList.remove("active");
  });

  // Close modals on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      reportModal.classList.remove("active");
      alertModal.classList.remove("active");
      hotlineModal.classList.remove("active");
      mapDescModal.classList.remove("active");
    }
  });
}

// Handle window resize
window.addEventListener("resize", () => {
  const sidebarLeft = document.getElementById("sidebarLeft");
  const navbar = document.querySelector(".navbar");

  if (window.innerWidth > 968) {
    sidebarLeft.classList.remove("active");
  }

  if (
    window.innerWidth > 480 &&
    navbar.classList.contains("notification-overlay")
  ) {
    closeNotificationOverlay();
  }

  // Invalidate map size on resize
  if (map) {
    map.invalidateSize();
  }
});
