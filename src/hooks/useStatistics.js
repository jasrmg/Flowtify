import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

export const useStatistics = () => {
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    verifiedReports: 0,
    resolvedReports: 0,
    totalUsers: 0,
    activeAlerts: 0,
  });

  const [previousStats, setPreviousStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    verifiedReports: 0,
    resolvedReports: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    // Calculate date 30 days ago for comparison
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Subscribe to reports collection
    const reportsQuery = query(collection(db, "reports"));
    const unsubscribeReports = onSnapshot(
      reportsQuery,
      (snapshot) => {
        const allReports = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Current stats
        const totalReports = allReports.length;
        const pendingReports = allReports.filter(
          (r) => r.status === "pending"
        ).length;
        const verifiedReports = allReports.filter(
          (r) => r.status === "verified" || r.verifiedAt
        ).length;
        const resolvedReports = allReports.filter(
          (r) => r.status === "resolved" || r.resolvedAt
        ).length;

        // Previous month stats (for comparison)
        const oldReports = allReports.filter((r) => {
          const createdAt = r.createdAt?.toDate();
          return createdAt && createdAt < thirtyDaysAgo;
        });

        setPreviousStats({
          totalReports: oldReports.length,
          pendingReports: oldReports.filter((r) => r.status === "pending")
            .length,
          verifiedReports: oldReports.filter(
            (r) => r.status === "verified" || r.verifiedAt
          ).length,
          resolvedReports: oldReports.filter(
            (r) => r.status === "resolved" || r.resolvedAt
          ).length,
        });

        setStats((prev) => ({
          ...prev,
          totalReports,
          pendingReports,
          verifiedReports,
          resolvedReports,
        }));
      },
      (err) => {
        console.error("Error fetching reports:", err);
        setError(err.message);
      }
    );

    // Subscribe to users collection
    const usersQuery = query(collection(db, "users"));
    const unsubscribeUsers = onSnapshot(
      usersQuery,
      (snapshot) => {
        const totalUsers = snapshot.size;
        setStats((prev) => ({ ...prev, totalUsers }));
      },
      (err) => {
        console.error("Error fetching users:", err);
      }
    );

    // Subscribe to alerts collection
    const alertsQuery = query(
      collection(db, "alerts"),
      where("isActive", "==", true)
    );
    const unsubscribeAlerts = onSnapshot(
      alertsQuery,
      (snapshot) => {
        const activeAlerts = snapshot.size;
        setStats((prev) => ({ ...prev, activeAlerts }));
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching alerts:", err);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeReports();
      unsubscribeUsers();
      unsubscribeAlerts();
    };
  }, []);

  // Calculate percentage changes
  const calculateChange = (current, previous) => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const change = ((current - previous) / previous) * 100;
    return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  };

  const statsWithChanges = [
    {
      id: 1,
      title: "Total Reports",
      value: stats.totalReports,
      change: calculateChange(stats.totalReports, previousStats.totalReports),
      changeType:
        stats.totalReports >= previousStats.totalReports
          ? "positive"
          : "negative",
      period: "vs last month",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      ),
      iconType: "primary",
    },
    {
      id: 2,
      title: "Pending Reports",
      value: stats.pendingReports,
      change: calculateChange(
        stats.pendingReports,
        previousStats.pendingReports
      ),
      changeType:
        stats.pendingReports <= previousStats.pendingReports
          ? "positive"
          : "negative",
      period: "vs last month",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      ),
      iconType: "warning",
    },
    {
      id: 3,
      title: "Verified Reports",
      value: stats.verifiedReports,
      change: calculateChange(
        stats.verifiedReports,
        previousStats.verifiedReports
      ),
      changeType:
        stats.verifiedReports >= previousStats.verifiedReports
          ? "positive"
          : "negative",
      period: "vs last month",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      ),
      iconType: "success",
    },
    {
      id: 4,
      title: "Resolved Reports",
      value: stats.resolvedReports,
      change: calculateChange(
        stats.resolvedReports,
        previousStats.resolvedReports
      ),
      changeType:
        stats.resolvedReports >= previousStats.resolvedReports
          ? "positive"
          : "negative",
      period: "vs last month",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      ),
      iconType: "success",
    },
    {
      id: 5,
      title: "Total Users",
      value: stats.totalUsers,
      change: "Real-time",
      changeType: "positive",
      period: "active users",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      iconType: "accent",
    },
    {
      id: 6,
      title: "Active Alerts",
      value: stats.activeAlerts,
      change: "Live",
      changeType: stats.activeAlerts > 0 ? "negative" : "positive",
      period: "right now",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      ),
      iconType: "error",
    },
  ];

  return { stats: statsWithChanges, loading, error };
};
