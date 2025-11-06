"use client";
import { useState, useEffect } from "react";
import { useAlerts } from "@/hooks/useAlerts";
import { useEmergencyHotlines } from "@/hooks/useEmergencyHotlines";

import { getAlertClass, formatAlertTime } from "@/utils/alertHelpers";

import "./RightSidebar.css";

export const RightSidebar = () => {
  const [currentTip, setCurrentTip] = useState(0);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);
  const { alerts, loading: alertsLoading } = useAlerts();
  const { hotlines, loading: hotlinesLoading } = useEmergencyHotlines();

  const safetyTips = [
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      ),
      text: "Never walk through moving water. Six inches of moving water can knock you down.",
    },
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      ),
      text: "Keep important documents and valuables in waterproof containers in elevated areas.",
    },
    {
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
          <line x1="6" y1="1" x2="6" y2="4"></line>
          <line x1="10" y1="1" x2="10" y2="4"></line>
          <line x1="14" y1="1" x2="14" y2="4"></line>
        </svg>
      ),
      text: "Prepare an emergency kit with flashlight, radio, first aid supplies, and food.",
    },
  ];

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async (latitude, longitude) => {
      try {
        const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

        if (!API_KEY) {
          throw new Error("API key not configured");
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
        console.log("Fetching weather for location:", latitude, longitude);

        const response = await fetch(url);

        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);

        if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error:", errorData);
          throw new Error(
            `Failed to fetch weather data: ${
              errorData.message || response.statusText
            }`
          );
        }

        const data = await response.json();
        setWeather(data);
        setWeatherLoading(false);
      } catch (error) {
        console.error("Weather fetch error:", error);
        setWeatherError(error.message);
        setWeatherLoading(false);
      }
    };

    // Get user's location
    const getUserLocationAndFetchWeather = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // User allowed location access
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            console.log("Using user location:", userLat, userLon);
            fetchWeather(userLat, userLon);
          },
          (error) => {
            // User denied or error occurred, fallback to Cebu City
            console.log("Geolocation error, using Cebu City:", error.message);
            const cebuLat = 10.3157;
            const cebuLon = 123.8854;
            fetchWeather(cebuLat, cebuLon);
          }
        );
      } else {
        // Browser doesn't support geolocation, fallback to Cebu City
        console.log("Geolocation not supported, using Cebu City");
        const cebuLat = 10.3157;
        const cebuLon = 123.8854;
        fetchWeather(cebuLat, cebuLon);
      }
    };

    getUserLocationAndFetchWeather();

    // Refresh weather every 10 minutes
    const interval = setInterval(getUserLocationAndFetchWeather, 600000);

    return () => clearInterval(interval);
  }, []);
  // Auto-rotate tips
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % safetyTips.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [safetyTips.length]);

  return (
    <aside className="sidebar-right" id="sidebarRight">
      <div className="sidebar-section">
        <h3>Emergency & Safety Info</h3>

        {/* Weather Section - NEW */}
        <div className="sidebar-section weather-section">
          <h4>Current Weather</h4>
          {weatherLoading ? (
            <div className="weather-loading">
              <svg
                style={{
                  width: "24px",
                  height: "24px",
                  animation: "spin 1s linear infinite",
                }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
              </svg>
              <span>Loading weather...</span>
            </div>
          ) : weatherError ? (
            <div className="weather-error">
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
              <span>Unable to load weather</span>
            </div>
          ) : weather ? (
            <div className="weather-content">
              <div className="weather-main">
                <div className="weather-icon">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt={weather.weather[0].description}
                  />
                </div>
                <div className="weather-temp">
                  <span className="temp-value">
                    {Math.round(weather.main.temp)}°
                  </span>
                  <span className="temp-unit">C</span>
                </div>
              </div>
              <div className="weather-description">
                {weather.weather[0].description.charAt(0).toUpperCase() +
                  weather.weather[0].description.slice(1)}
              </div>
              <div className="weather-details">
                <div className="weather-detail-item">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                  </svg>
                  <span>
                    Feels like {Math.round(weather.main.feels_like)}°C
                  </span>
                </div>
                <div className="weather-detail-item">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                  </svg>
                  <span>Humidity {weather.main.humidity}%</span>
                </div>
                <div className="weather-detail-item">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>
                  </svg>
                  <span>Wind {Math.round(weather.wind.speed)} m/s</span>
                </div>
              </div>
              <div className="weather-location">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{weather.name}</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="sidebar-section">
        <h4>Official Alerts</h4>
        {alertsLoading ? (
          <div className="alerts-loading">
            <svg
              style={{
                width: "24px",
                height: "24px",
                animation: "spin 1s linear infinite",
              }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
            <span>Loading alerts...</span>
          </div>
        ) : alerts.length === 0 ? (
          <div className="alerts-empty">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
            <p>No active alerts</p>
            <span>All clear for now</span>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`alert-item ${getAlertClass(alert.severity)}`}
            >
              <div className="alert-header">
                <div className="alert-title">{alert.title}</div>
                {alert.severity && (
                  <span className={`alert-severity ${alert.severity}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                )}
              </div>
              {alert.location && (
                <div className="alert-location">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>{alert.location}</span>
                </div>
              )}
              <div className="alert-time">
                {formatAlertTime(alert.timestamp)}
              </div>
              <p>{alert.message}</p>
            </div>
          ))
        )}
      </div>

      <div className="sidebar-section">
        <h4>Emergency Hotlines</h4>
        {hotlinesLoading ? (
          <div className="hotlines-loading">
            <svg
              style={{
                width: "24px",
                height: "24px",
                animation: "spin 1s linear infinite",
              }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
            <span>Loading hotlines...</span>
          </div>
        ) : hotlines.length === 0 ? (
          <div className="hotlines-empty">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <p>No hotlines available</p>
            <span>Check back later</span>
          </div>
        ) : (
          <ul className="hotline-list">
            {hotlines.map((hotline) => (
              <li key={hotline.id} className="hotline-item">
                <div className="hotline-info">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <div className="hotline-text">
                    <span className="hotline-name">{hotline.agencyName}</span>
                    {hotline.description && (
                      <span className="hotline-description">
                        {hotline.description}
                      </span>
                    )}
                  </div>
                </div>
                <a
                  href={`tel:${hotline.contactNumber}`}
                  className="hotline-number"
                >
                  {hotline.contactNumber}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="sidebar-section">
        <h4>Safety Tips</h4>
        <div className="tips-carousel">
          {safetyTips.map((tip, index) => (
            <div
              key={index}
              className={`tip-content ${index === currentTip ? "active" : ""}`}
            >
              {tip.icon}
              <p>{tip.text}</p>
            </div>
          ))}
        </div>
        <div className="carousel-dots">
          {safetyTips.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentTip ? "active" : ""}`}
              onClick={() => setCurrentTip(index)}
            ></span>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h4>Resource Links</h4>
        <ul className="resource-links">
          <li>
            <a
              href="https://bagong.pagasa.dost.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              PAGASA Weather
            </a>
          </li>
          <li>
            <a
              href="https://ndrrmc.gov.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              NDRRMC
            </a>
          </li>
          <li>
            <a
              href="https://noah.up.edu.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="resource-link"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              Project NOAH
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default RightSidebar;
