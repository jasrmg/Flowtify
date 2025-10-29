// Global variables
let allReports = [];
let filteredReports = [];
let currentPage = 1;
let reportsPerPage = 9;
let deleteReportId = null;

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  initializeTheme();
  initializeEventListeners();
  loadReports();
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
    showToast("Logged out successfully", "info");
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
        return; // Don't close in overlay mode
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

  // Status filter
  const statusFilter = document.getElementById("statusFilter");
  statusFilter.addEventListener("change", () => {
    applyFilters();
  });

  // Sort filter
  const sortFilter = document.getElementById("sortFilter");
  sortFilter.addEventListener("change", () => {
    applyFilters();
  });

  // New report button
  const newReportBtn = document.getElementById("newReportBtn");
  newReportBtn.addEventListener("click", () => {
    showToast("Redirecting to new report form...", "info");
  });

  // Submit report button (empty state)
  const submitReportBtn = document.getElementById("submitReportBtn");
  submitReportBtn.addEventListener("click", () => {
    showToast("Redirecting to new report form...", "info");
  });

  // Pagination buttons
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderReports();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  nextBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderReports();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  // Delete modal
  const deleteModal = document.getElementById("deleteModal");
  const modalOverlay = document.getElementById("modalOverlay");
  const modalClose = document.getElementById("modalClose");
  const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

  modalOverlay.addEventListener("click", () => {
    closeDeleteModal();
  });

  modalClose.addEventListener("click", () => {
    closeDeleteModal();
  });

  cancelDeleteBtn.addEventListener("click", () => {
    closeDeleteModal();
  });

  confirmDeleteBtn.addEventListener("click", () => {
    confirmDelete();
  });

  // Navigation links
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      // Allow actual navigation for home link
      const page = link.getAttribute("data-page");
      if (page === "home" || page === "map" || page === "reports") {
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
    });
  });
}

/**
 * Load reports from mock API
 */
async function loadReports() {
  const loadingIndicator = document.getElementById("loadingIndicator");
  const reportsGrid = document.getElementById("reportsGrid");
  const emptyState = document.getElementById("emptyState");

  try {
    // Show loading indicator
    loadingIndicator.classList.remove("hidden");
    reportsGrid.innerHTML = "";
    emptyState.classList.add("hidden");

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In production, this would be: const response = await fetch('/my-reports/data/');
    // const data = await response.json();

    // Mock data
    const mockData = [
      {
        id: 1,
        barangay: "Lahug",
        description: "Knee-deep flood near IT Park. Road impassable.",
        photo: null,
        timestamp: "2025-10-29T09:45:00",
        status: "pending",
        admin_note: null,
      },
      {
        id: 2,
        barangay: "Mabolo",
        description: "Cleared area after drainage fix.",
        photo: null,
        timestamp: "2025-10-28T17:12:00",
        status: "resolved",
        admin_note: null,
      },
      {
        id: 3,
        barangay: "Capitol Site",
        description: "Severe flooding blocking main entrance.",
        photo: null,
        timestamp: "2025-10-29T14:30:00",
        status: "verified",
        admin_note: null,
      },
      {
        id: 4,
        barangay: "Guadalupe",
        description: "Minor waterlogging near market area.",
        photo: null,
        timestamp: "2025-10-27T08:20:00",
        status: "resolved",
        admin_note: null,
      },
      {
        id: 5,
        barangay: "Kamputhaw",
        description: "Flash flood reported. Immediate attention needed.",
        photo: null,
        timestamp: "2025-10-29T11:15:00",
        status: "verified",
        admin_note: null,
      },
      {
        id: 6,
        barangay: "Kasambagan",
        description: "Photo unclear. Cannot verify flood level.",
        photo: null,
        timestamp: "2025-10-26T16:45:00",
        status: "rejected",
        admin_note: "Please upload a clearer image of the flooded area.",
      },
      {
        id: 7,
        barangay: "Apas",
        description: "Water accumulation near residential area.",
        photo: null,
        timestamp: "2025-10-29T07:55:00",
        status: "pending",
        admin_note: null,
      },
      {
        id: 8,
        barangay: "Banilad",
        description: "Moderate flooding on main road.",
        photo: null,
        timestamp: "2025-10-28T13:20:00",
        status: "verified",
        admin_note: null,
      },
      {
        id: 9,
        barangay: "Talamban",
        description: "Flood subsided. Road now passable.",
        photo: null,
        timestamp: "2025-10-27T19:30:00",
        status: "resolved",
        admin_note: null,
      },
      {
        id: 10,
        barangay: "Busay",
        description: "Heavy rainfall causing street flooding.",
        photo: null,
        timestamp: "2025-10-29T12:40:00",
        status: "pending",
        admin_note: null,
      },
    ];

    allReports = mockData;
    filteredReports = [...allReports];

    // Render reports
    renderReports();
  } catch (error) {
    console.error("Error loading reports:", error);
    showToast("Failed to load reports. Please try again.", "error");
  } finally {
    // Hide loading indicator
    loadingIndicator.classList.add("hidden");
  }
}

/**
 * Apply filters to reports
 */
function applyFilters() {
  const statusFilter = document.getElementById("statusFilter").value;
  const sortFilter = document.getElementById("sortFilter").value;

  // Start with all reports
  let filtered = [...allReports];

  // Apply status filter
  if (statusFilter !== "all") {
    filtered = filtered.filter((report) => report.status === statusFilter);
  }

  // Apply sort
  if (sortFilter === "newest") {
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } else {
    filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  filteredReports = filtered;
  currentPage = 1; // Reset to first page
  renderReports();
}

/**
 * Render reports to the grid
 */
function renderReports() {
  const reportsGrid = document.getElementById("reportsGrid");
  const emptyState = document.getElementById("emptyState");
  const pagination = document.getElementById("pagination");

  // Check if there are reports
  if (filteredReports.length === 0) {
    reportsGrid.innerHTML = "";
    emptyState.classList.remove("hidden");
    pagination.classList.add("hidden");
    return;
  }

  // Hide empty state
  emptyState.classList.add("hidden");

  // Calculate pagination
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
  const startIndex = (currentPage - 1) * reportsPerPage;
  const endIndex = startIndex + reportsPerPage;
  const reportsToShow = filteredReports.slice(startIndex, endIndex);

  // Render report cards
  reportsGrid.innerHTML = reportsToShow.map(createReportCard).join("");

  // Add event listeners to action buttons
  addActionListeners();

  // Update pagination
  updatePagination(totalPages);

  // Show pagination if there are multiple pages
  if (totalPages > 1) {
    pagination.classList.remove("hidden");
  } else {
    pagination.classList.add("hidden");
  }
}

/**
 * Create HTML for a report card
 */
function createReportCard(report) {
  const timeAgo = formatTimeAgo(report.timestamp);
  const statusClass = report.status;
  const statusText =
    report.status.charAt(0).toUpperCase() + report.status.slice(1);

  const adminNoteHTML = report.admin_note
    ? `
    <div class="admin-note">
      <div class="admin-note-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        Admin Notes:
      </div>
      <div class="admin-note-text">${report.admin_note}</div>
    </div>
  `
    : "";

  return `
    <div class="report-card" data-id="${report.id}">
      <div class="report-image">
        ${
          report.photo
            ? `<img src="${report.photo}" alt="Flood report photo" />`
            : `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
          </svg>
        `
        }
        <span class="report-status-badge ${statusClass}">${statusText}</span>
      </div>
      <div class="report-content">
        <div class="report-header">
          <div class="report-location">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Barangay ${report.barangay}
          </div>
        </div>
        <p class="report-description">${report.description}</p>
        <div class="report-time">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          ${timeAgo}
        </div>
        ${adminNoteHTML}
        <div class="report-actions">
          <button class="btn-action btn-view" data-action="view" data-id="${
            report.id
          }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span>View</span>
          </button>
          <button class="btn-action btn-edit" data-action="edit" data-id="${
            report.id
          }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            <span>Edit</span>
          </button>
          <button class="btn-action btn-delete" data-action="delete" data-id="${
            report.id
          }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Add event listeners to action buttons
 */
function addActionListeners() {
  const actionButtons = document.querySelectorAll(".btn-action");

  actionButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const action = button.getAttribute("data-action");
      const reportId = parseInt(button.getAttribute("data-id"));

      switch (action) {
        case "view":
          viewReport(reportId);
          break;
        case "edit":
          editReport(reportId);
          break;
        case "delete":
          openDeleteModal(reportId);
          break;
      }
    });
  });
}

/**
 * View report details
 */
function viewReport(reportId) {
  console.log("Viewing report:", reportId);
  showToast(`Opening report #${reportId}...`, "info");
  // In production, this would navigate to a detailed report page
}

/**
 * Edit report
 */
function editReport(reportId) {
  console.log("Editing report:", reportId);
  showToast(`Redirecting to edit report #${reportId}...`, "info");
  // In production, this would navigate to an edit form
}

/**
 * Open delete confirmation modal
 */
function openDeleteModal(reportId) {
  deleteReportId = reportId;
  const modal = document.getElementById("deleteModal");
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

/**
 * Close delete confirmation modal
 */
function closeDeleteModal() {
  deleteReportId = null;
  const modal = document.getElementById("deleteModal");
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}

/**
 * Confirm and execute delete
 */
async function confirmDelete() {
  if (!deleteReportId) return;

  try {
    // In production, this would be: await fetch(`/my-reports/delete/${deleteReportId}/`, { method: 'DELETE' });

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Remove report from arrays
    allReports = allReports.filter((r) => r.id !== deleteReportId);
    filteredReports = filteredReports.filter((r) => r.id !== deleteReportId);

    // Re-render reports
    renderReports();

    // Show success message
    showToast("Report deleted successfully", "success");

    // Close modal
    closeDeleteModal();
  } catch (error) {
    console.error("Error deleting report:", error);
    showToast("Failed to delete report. Please try again.", "error");
  }
}

/**
 * Update pagination UI
 */
function updatePagination(totalPages) {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const currentPageSpan = document.getElementById("currentPage");
  const totalPagesSpan = document.getElementById("totalPages");

  currentPageSpan.textContent = currentPage;
  totalPagesSpan.textContent = totalPages;

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

/**
 * Format timestamp to relative time
 */
function formatTimeAgo(timestamp) {
  const now = new Date();
  const then = new Date(timestamp);
  const diffInSeconds = Math.floor((now - then) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return then.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Show toast notification
 */
function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  const toastIcon = document.getElementById("toastIcon");
  const toastMessage = document.getElementById("toastMessage");

  // Set icon based on type
  let iconSVG = "";
  if (type === "success") {
    iconSVG = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    `;
  } else if (type === "error") {
    iconSVG = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
    `;
  } else {
    iconSVG = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    `;
  }

  toastIcon.innerHTML = iconSVG;
  toastMessage.textContent = message;

  // Remove existing type classes
  toast.classList.remove("success", "error", "info");

  // Add new type class
  toast.classList.add(type);

  // Show toast
  toast.classList.remove("hidden");
  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.classList.add("hidden");
    }, 300);
  }, 3000);
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
