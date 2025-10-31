"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import the map component with no SSR
const FloodMap = dynamic(
  () => import("./FloodMap").then((mod) => mod.FloodMap),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: "600px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--bg-secondary)",
          borderRadius: "16px",
          color: "var(--text-secondary)",
        }}
      >
        Loading map...
      </div>
    ),
  }
);

export const FloodMapWrapper = ({ markers, onViewDescription }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div
        style={{
          height: "600px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--bg-secondary)",
          borderRadius: "16px",
          color: "var(--text-secondary)",
        }}
      >
        Loading map...
      </div>
    );
  }

  return <FloodMap markers={markers} onViewDescription={onViewDescription} />;
};
