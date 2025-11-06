"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import "./RouteLoader.css";

export default function RouteLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevPathname = useRef(pathname);
  const prevSearchParams = useRef(searchParams?.toString());

  useEffect(() => {
    const currentSearch = searchParams?.toString();
    const pathChanged = prevPathname.current !== pathname;
    const searchChanged = prevSearchParams.current !== currentSearch;

    // Only show loader if route actually changed (not on initial mount)
    if (pathChanged || searchChanged) {
      // Use requestAnimationFrame to avoid cascading renders
      const raf = requestAnimationFrame(() => {
        setShouldRender(true);
        setIsLoading(true);
      });

      // Hide loader after delay
      const hideTimer = setTimeout(() => {
        setIsLoading(false);
      }, 800);

      // Remove from DOM after fade-out
      const removeTimer = setTimeout(() => {
        setShouldRender(false);
      }, 1000);

      // Update refs
      prevPathname.current = pathname;
      prevSearchParams.current = currentSearch;

      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(hideTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [pathname, searchParams]);

  if (!shouldRender) return null;

  return (
    <div className={`route-loader-overlay ${!isLoading ? "fade-out" : ""}`}>
      <div className="route-loader-content">
        {/* Ripple Wave Animation */}
        <div className="ripple-container">
          <svg className="ripple-svg" viewBox="0 0 200 200">
            <circle
              className="ripple-circle ripple-1"
              cx="100"
              cy="100"
              r="20"
            />
            <circle
              className="ripple-circle ripple-2"
              cx="100"
              cy="100"
              r="20"
            />
            <circle
              className="ripple-circle ripple-3"
              cx="100"
              cy="100"
              r="20"
            />
            <circle className="ripple-core" cx="100" cy="100" r="12" />
          </svg>
        </div>

        {/* Loading Text */}
        <p className="route-loader-text">Getting things ready...</p>
      </div>
    </div>
  );
}
