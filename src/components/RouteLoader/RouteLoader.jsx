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
  const timersRef = useRef({ raf: null, hide: null, remove: null });

  useEffect(() => {
    const currentSearch = searchParams?.toString();
    const pathChanged = prevPathname.current !== pathname;
    const searchChanged = prevSearchParams.current !== currentSearch;

    // Only show loader if route actually changed
    if (pathChanged || searchChanged) {
      // Clear any existing timers first
      if (timersRef.current.raf) cancelAnimationFrame(timersRef.current.raf);
      if (timersRef.current.hide) clearTimeout(timersRef.current.hide);
      if (timersRef.current.remove) clearTimeout(timersRef.current.remove);

      // Show loader
      timersRef.current.raf = requestAnimationFrame(() => {
        setShouldRender(true);
        setIsLoading(true);
      });

      // CRITICAL: Always hide loader after timeout, no matter what
      timersRef.current.hide = setTimeout(() => {
        setIsLoading(false);
      }, 600);

      // CRITICAL: Always remove from DOM, no matter what
      timersRef.current.remove = setTimeout(() => {
        setShouldRender(false);
      }, 800);

      // Update refs
      prevPathname.current = pathname;
      prevSearchParams.current = currentSearch;
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (timersRef.current.raf) cancelAnimationFrame(timersRef.current.raf);
      if (timersRef.current.hide) clearTimeout(timersRef.current.hide);
      if (timersRef.current.remove) clearTimeout(timersRef.current.remove);
    };
  }, [pathname, searchParams]);

  // Force cleanup on unmount (when user logs out)
  useEffect(() => {
    return () => {
      // Ensure loader is fully cleaned up when component unmounts
      setShouldRender(false);
      setIsLoading(false);
      if (timersRef.current.raf) cancelAnimationFrame(timersRef.current.raf);
      if (timersRef.current.hide) clearTimeout(timersRef.current.hide);
      if (timersRef.current.remove) clearTimeout(timersRef.current.remove);
    };
  }, []);

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
