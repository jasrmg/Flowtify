"use client";
import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

export function useAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Query only active alerts, ordered by timestamp (newest first)
    const alertsQuery = query(
      collection(db, "alerts"),
      where("isActive", "==", true),
      orderBy("timestamp", "desc")
    );

    // Real-time listener
    const unsubscribe = onSnapshot(
      alertsQuery,
      (snapshot) => {
        const alertsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAlerts(alertsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching alerts:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { alerts, loading };
}
