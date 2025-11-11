"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "../components/ThemeToggle";

import { useToast } from "@/hooks/useToast";

import styles from "./AuthPage.module.css";
import formStyles from "./AuthForm.module.css";
import illustrationStyles from "./AuthIllustration.module.css";

export default function AuthPage() {
  const router = useRouter();
  const { login, signup, currentUser, userRole } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  // password visibility
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { showToast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser && userRole) {
      if (userRole === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/feed");
      }
    }
  }, [currentUser, userRole, router]);

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    if (password.length === 0) return "";
    if (password.length < 6) return "weak";

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    if (strength < 2) return "weak";
    if (strength < 3) return "medium";
    return "strong";
  };

  // Switch between login and signup tabs
  const switchTab = (tab) => {
    setActiveTab(tab);
    setError("");
    setPasswordStrength("");
  };

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!loginData.email || !loginData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    const result = await login(loginData.email, loginData.password);

    if (result.success) {
      // Redirect based on role
      if (result.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/feed");
      }
    } else {
      setError(
        result.error || "Failed to login. Please check your credentials."
      );
    }

    setLoading(false);
  };

  // Handle signup form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate all fields are filled
    if (
      !signupData.firstName ||
      !signupData.lastName ||
      !signupData.email ||
      !signupData.password ||
      !signupData.confirmPassword
    ) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    // Validate password length
    if (signupData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    // Validate passwords match
    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate email format (basic check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    // Call signup function
    const result = await signup(
      signupData.email,
      signupData.password,
      signupData.firstName,
      signupData.lastName
    );

    if (result.success) {
      // Show success message
      showToast(
        "Account created successfully! Please login with your credentials.",
        "success"
      );

      // Clear form
      setSignupData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Switch to login tab
      switchTab("login");
    } else {
      setError(result.error || "Failed to create account. Please try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <ThemeToggle />

      <div className={styles.authPage}>
        {/* Illustration Side */}
        <div className={styles.illustrationContainer}>
          <svg
            viewBox="0 0 500 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Rain clouds */}
            <ellipse
              cx="150"
              cy="100"
              rx="60"
              ry="40"
              fill="#3FA9F5"
              opacity="0.8"
            />
            <ellipse
              cx="200"
              cy="90"
              rx="70"
              ry="45"
              fill="#3FA9F5"
              opacity="0.8"
            />
            <ellipse
              cx="120"
              cy="90"
              rx="50"
              ry="35"
              fill="#3FA9F5"
              opacity="0.8"
            />

            <ellipse
              cx="350"
              cy="120"
              rx="55"
              ry="38"
              fill="#32B67A"
              opacity="0.7"
            />
            <ellipse
              cx="400"
              cy="110"
              rx="65"
              ry="42"
              fill="#32B67A"
              opacity="0.7"
            />
            <ellipse
              cx="320"
              cy="110"
              rx="48"
              ry="32"
              fill="#32B67A"
              opacity="0.7"
            />

            {/* Rain drops */}
            <path
              d="M 150 160 C 144 184 144 192 150 194 C 156 192 156 184 150 160 Z"
              fill="#3FA9F5"
              opacity="0.6"
              className={illustrationStyles.raindrop}
              style={{ animationDelay: "0s" }}
            />
            <path
              d="M 180 170 C 174 194 174 202 180 204 C 186 202 186 194 180 170 Z"
              fill="#3FA9F5"
              opacity="0.6"
              className={illustrationStyles.raindrop}
              style={{ animationDelay: "0.3s" }}
            />
            <path
              d="M 120 165 C 114 189 114 197 120 199 C 126 197 126 189 120 165 Z"
              fill="#3FA9F5"
              opacity="0.6"
              className={illustrationStyles.raindrop}
              style={{ animationDelay: "0.6s" }}
            />
            <path
              d="M 200 175 C 194 199 194 207 200 209 C 206 207 206 199 200 175 Z"
              fill="#3FA9F5"
              opacity="0.6"
              className={illustrationStyles.raindrop}
              style={{ animationDelay: "0.9s" }}
            />

            <path
              d="M 350 170 C 344 194 344 202 350 204 C 356 202 356 194 350 170 Z"
              fill="#32B67A"
              opacity="0.5"
              className={illustrationStyles.raindrop}
              style={{ animationDelay: "0.2s" }}
            />
            <path
              d="M 380 175 C 374 199 374 207 380 209 C 386 207 386 199 380 175 Z"
              fill="#32B67A"
              opacity="0.5"
              className={illustrationStyles.raindrop}
              style={{ animationDelay: "0.5s" }}
            />
            <path
              d="M 320 168 C 314 192 314 200 320 202 C 326 200 326 192 320 168 Z"
              fill="#32B67A"
              opacity="0.5"
              className={illustrationStyles.raindrop}
              style={{ animationDelay: "0.8s" }}
            />

            {/* Water waves */}
            <g>
              <path
                d="M50 350 Q100 330 150 350 T250 350 T350 350 T450 350"
                stroke="#3FA9F5"
                strokeWidth="6"
                fill="none"
                opacity="0.4"
                className={illustrationStyles.waterWaves}
              />
              <path
                d="M50 370 Q100 350 150 370 T250 370 T350 370 T450 370"
                stroke="#32B67A"
                strokeWidth="6"
                fill="none"
                opacity="0.4"
                className={illustrationStyles.waterWaves}
              />
              <path
                d="M50 390 Q100 370 150 390 T250 390 T350 390 T450 390"
                stroke="#3FA9F5"
                strokeWidth="5"
                fill="none"
                opacity="0.3"
                className={illustrationStyles.waterWaves}
              />
            </g>

            {/* House protected by umbrella */}
            <rect
              x="200"
              y="280"
              width="100"
              height="80"
              fill="white"
              opacity="0.9"
            />
            <path
              d="M190 280 L250 240 L310 280 Z"
              fill="#3FA9F5"
              opacity="0.9"
            />
            <rect
              x="235"
              y="310"
              width="30"
              height="50"
              fill="#3FA9F5"
              opacity="0.7"
            />

            {/* Notification bell */}
            <g>
              <circle
                cx="350"
                cy="280"
                r="22"
                fill="#32B67A"
                opacity="0.9"
                className={illustrationStyles.circlePulse}
              />
              <g className={illustrationStyles.phoneVibrate}>
                <path
                  d="M343 273 L343 288 C343 290 345 292 347 292 L353 292 C355 292 357 290 357 288 L357 273 C357 271 355 269 353 269 L347 269 C345 269 343 271 343 273 Z M345 285 L355 285 M350 289 C350.5 289 351 288.5 351 288 C351 287.5 350.5 287 350 287 C349.5 287 349 287.5 349 288 C349 288.5 349.5 289 350 289 Z"
                  fill="white"
                />
                <circle cx="356" cy="271" r="4" fill="#FF6B6B" />
              </g>
            </g>
          </svg>
        </div>

        {/* Form Side */}
        <div className={styles.formContainer}>
          <div className={styles.formWrapper}>
            <Link href="/" className={styles.backHome}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>

            <div className={formStyles.formHeader}>
              <h2 className={formStyles.formTitle}>
                {activeTab === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className={formStyles.formSubtitle}>
                {activeTab === "login"
                  ? "Sign in to your account to continue"
                  : "Join Flowtify and stay ahead of floods"}
              </p>
            </div>

            <div className={formStyles.formTabs}>
              <button
                className={`${formStyles.formTab} ${
                  activeTab === "login" ? formStyles.active : ""
                }`}
                onClick={() => switchTab("login")}
              >
                Login
              </button>
              <button
                className={`${formStyles.formTab} ${
                  activeTab === "signup" ? formStyles.active : ""
                }`}
                onClick={() => switchTab("signup")}
              >
                Sign Up
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className={formStyles.errorAlert}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {error}
              </div>
            )}

            {/* Login Form */}
            <div
              className={`${formStyles.formContent} ${
                activeTab === "login" ? formStyles.active : ""
              }`}
            >
              <form onSubmit={handleLogin}>
                <div className={formStyles.formGroup}>
                  <label htmlFor="loginEmail">Email</label>
                  <input
                    type="email"
                    id="loginEmail"
                    placeholder="your@email.com"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    disabled={loading}
                    required
                  />
                </div>
                <div className={formStyles.formGroup}>
                  <label htmlFor="loginPassword">Password</label>
                  <div className={formStyles.passwordInputWrapper}>
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      id="loginPassword"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      className={formStyles.passwordToggle}
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      aria-label={
                        showLoginPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showLoginPassword ? (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: "100%" }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className={formStyles.spinner}></span>
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>
              <div className={formStyles.formFooter}>
                <p>
                  Don&apos;t have an account?{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      switchTab("signup");
                    }}
                  >
                    Sign up now
                  </a>
                </p>
              </div>
            </div>

            {/* Signup Form */}
            <div
              className={`${formStyles.formContent} ${
                activeTab === "signup" ? formStyles.active : ""
              }`}
            >
              <form onSubmit={handleSignup}>
                <div className={formStyles.formRow}>
                  <div className={formStyles.formGroup}>
                    <label htmlFor="signupFirstName">First Name</label>
                    <input
                      type="text"
                      id="signupFirstName"
                      placeholder="John"
                      value={signupData.firstName}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          firstName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className={formStyles.formGroup}>
                    <label htmlFor="signupLastName">Last Name</label>
                    <input
                      type="text"
                      id="signupLastName"
                      placeholder="Doe"
                      value={signupData.lastName}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          lastName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className={formStyles.formGroup}>
                  <label htmlFor="signupEmail">Email</label>
                  <input
                    type="email"
                    id="signupEmail"
                    placeholder="your@email.com"
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({ ...signupData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className={formStyles.formGroup}>
                  <label htmlFor="signupPassword">Password</label>
                  <div className={formStyles.passwordInputWrapper}>
                    <input
                      type={showSignupPassword ? "text" : "password"}
                      id="signupPassword"
                      placeholder="Create a password (min. 6 characters)"
                      value={signupData.password}
                      onChange={(e) => {
                        const newPassword = e.target.value;
                        setSignupData({
                          ...signupData,
                          password: newPassword,
                        });
                        setPasswordStrength(
                          calculatePasswordStrength(newPassword)
                        );
                      }}
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      className={formStyles.passwordToggle}
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      aria-label={
                        showSignupPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showSignupPassword ? (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                  {signupData.password && (
                    <div className={formStyles.passwordStrength}>
                      <div className={formStyles.passwordStrengthBar}>
                        <div
                          className={`${formStyles.passwordStrengthFill} ${formStyles[passwordStrength]}`}
                        ></div>
                      </div>
                      <span
                        className={`${formStyles.passwordStrengthText} ${formStyles[passwordStrength]}`}
                      >
                        {passwordStrength}
                      </span>
                    </div>
                  )}
                </div>
                <div className={formStyles.formGroup}>
                  <label htmlFor="signupConfirmPassword">
                    Confirm Password
                  </label>
                  <div className={formStyles.passwordInputWrapper}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="signupConfirmPassword"
                      placeholder="Re-enter your password"
                      value={signupData.confirmPassword}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          confirmPassword: e.target.value,
                        })
                      }
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      className={formStyles.passwordToggle}
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                  {signupData.confirmPassword && (
                    <div
                      className={`${formStyles.passwordMatch} ${
                        signupData.password === signupData.confirmPassword
                          ? formStyles.match
                          : formStyles.noMatch
                      }`}
                    >
                      {signupData.password === signupData.confirmPassword ? (
                        <>
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          Passwords match
                        </>
                      ) : (
                        <>
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                          </svg>
                          Passwords do not match
                        </>
                      )}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: "100%" }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className={formStyles.spinner}></span>
                      Creating account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </form>
              <div className={formStyles.formFooter}>
                <p>
                  Already have an account?{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      switchTab("login");
                    }}
                  >
                    Login here
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
