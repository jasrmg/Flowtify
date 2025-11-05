"use client";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { currentUser, userRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        router.push("/auth");
      } else if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        // Redirect to appropriate dashboard based on role
        if (userRole === "admin") {
          router.push("/dashboard");
        } else {
          router.push("/feed");
        }
      }
    }
  }, [currentUser, userRole, loading, router, allowedRoles]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontSize: "1.2rem",
          color: "var(--text-secondary)",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return null;
  }

  return <>{children}</>;
}
