// Theme Toggle Functionality
function toggleTheme() {
  const body = document.body;
  const themeIcon = document.getElementById("themeIcon");
  const isDarkMode = body.classList.toggle("dark-mode");

  // Save theme preference
  try {
    if (isDarkMode) {
      themeIcon.innerHTML = `
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      `;
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
  } catch (e) {
    console.error("Failed to update theme icon:", e);
  }
}

// Load saved theme on page load
function loadTheme() {
  const themeIcon = document.getElementById("themeIcon");
  const isDarkMode = document.body.classList.contains("dark-mode");

  if (isDarkMode) {
    themeIcon.innerHTML = `
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    `;
  }
}

// Initialize theme on page load
document.addEventListener("DOMContentLoaded", function () {
  loadTheme();
});

// Toggle mobile menu
function toggleMobileMenu() {
  const navLinks = document.getElementById("navLinks");
  navLinks.classList.toggle("active");
}

// Show landing page
function showLanding() {
  document.getElementById("landingPage").style.display = "block";
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("navLinks").classList.remove("active");
  window.scrollTo(0, 0);
}

// Show login page
function showLogin() {
  document.getElementById("landingPage").style.display = "none";
  document.getElementById("loginPage").style.display = "block";
  document.getElementById("navLinks").classList.remove("active");
  window.scrollTo(0, 0);
}
// Switch between login and signup tabs
function switchTab(tab) {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const tabs = document.querySelectorAll(".form-tab");
  const formTitle = document.getElementById("formTitle");
  const formSubtitle = document.getElementById("formSubtitle");

  tabs.forEach((t) => t.classList.remove("active"));

  if (tab === "login") {
    loginForm.classList.add("active");
    signupForm.classList.remove("active");
    tabs[0].classList.add("active");
    formTitle.textContent = "Welcome Back";
    formSubtitle.textContent = "Sign in to your account to continue";
  } else {
    signupForm.classList.add("active");
    loginForm.classList.remove("active");
    tabs[1].classList.add("active");
    formTitle.textContent = "Create Account";
    formSubtitle.textContent = "Join Flowtify and stay ahead of floods";
  }
}

// Handle login form submission
function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value;
  alert(`Login functionality would connect here!\nEmail: ${email}`);
}

// Handle signup form submission
function handleSignup(event) {
  event.preventDefault();
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  alert(
    `Signup functionality would connect here!\nName: ${name}\nEmail: ${email}`
  );
}

// Close mobile menu when clicking outside
document.addEventListener("click", function (event) {
  const nav = document.getElementById("navLinks");
  const menuBtn = document.querySelector(".mobile-menu-btn");

  if (!nav.contains(event.target) && !menuBtn.contains(event.target)) {
    nav.classList.remove("active");
  }
});

// Add scroll effect to navbar
window.addEventListener("scroll", function () {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 50) {
    navbar.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
  } else {
    navbar.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.05)";
  }
});
