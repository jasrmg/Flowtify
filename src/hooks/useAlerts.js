"use client";
import { useState, useEffect } from "react";
import { logAlertCreation, logAlertDeactivation } from "@/utils/systemLogger";
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
  const createAlert = async (alertData, userId, userRole = "admin") => {
    try {
      const newAlert = {
        ...alertData,
        createdBy: userId,
        createdAt: Timestamp.now(),
        isActive: true,
      };

      const docRef = await addDoc(collection(db, "alerts"), newAlert);

      // Log the action
      await logAlertCreation(docRef.id, alertData.title, userId, userRole);

      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error creating alert:", error);
      return { success: false, error: error.message };
    }
  };

  // Deactivate alert
  const deactivateAlert = async (alertId, userId, userRole = "admin") => {
    try {
      // Get the alert data first for logging
      const alertToDeactivate = alerts.find((a) => a.id === alertId);
      const alertTitle = alertToDeactivate
        ? alertToDeactivate.title
        : "Unknown alert";

      const alertRef = doc(db, "alerts", alertId);
      await updateDoc(alertRef, {
        isActive: false,
        deactivatedAt: Timestamp.now(),
        deactivatedBy: userId,
      });

      // Log the action
      await logAlertDeactivation(alertId, alertTitle, userId, userRole);

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
