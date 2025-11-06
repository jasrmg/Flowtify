"use client";
import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

export function useAlerts(activeOnly = true) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Build query based on whether we want active only or all alerts
    let alertsQuery;
    if (activeOnly) {
      alertsQuery = query(
        collection(db, "alerts"),
        where("isActive", "==", true),
        orderBy("timestamp", "desc")
      );
    } else {
      alertsQuery = query(
        collection(db, "alerts"),
        orderBy("timestamp", "desc")
      );
    }

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
  }, [activeOnly]);

  // Create new alert
  const createAlert = async (alertData, userId) => {
    try {
      await addDoc(collection(db, "alerts"), {
        title: alertData.title,
        location: alertData.location,
        severity: alertData.severity,
        message: alertData.message,
        isActive: true,
        reportedBy: userId,
        timestamp: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      console.error("Error creating alert:", error);
      return { success: false, error: error.message };
    }
  };

  // Deactivate alert
  const deactivateAlert = async (alertId) => {
    try {
      await updateDoc(doc(db, "alerts", alertId), {
        isActive: false,
      });
      return { success: true };
    } catch (error) {
      console.error("Error deactivating alert:", error);
      return { success: false, error: error.message };
    }
  };

  return {
    alerts,
    loading,
    createAlert,
    deactivateAlert,
  };
}
