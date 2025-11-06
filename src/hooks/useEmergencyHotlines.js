"use client";
import { useState, useEffect } from "react";
import {
  logHotlineCreation,
  logHotlineUpdate,
  logHotlineDeletion,
} from "@/utils/systemLogger";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

export function useEmergencyHotlines(activeOnly = true) {
  const [hotlines, setHotlines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Build query based on whether we want active only or all hotlines
    let hotlinesQuery;
    if (activeOnly) {
      hotlinesQuery = query(
        collection(db, "emergencyHotlines"),
        where("isActive", "==", true),
        orderBy("createdAt", "desc")
      );
    } else {
      hotlinesQuery = query(
        collection(db, "emergencyHotlines"),
        orderBy("createdAt", "desc")
      );
    }

    // Real-time listener
    const unsubscribe = onSnapshot(
      hotlinesQuery,
      (snapshot) => {
        const hotlinesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setHotlines(hotlinesData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching emergency hotlines:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [activeOnly]);

  // Create new hotline
  const createHotline = async (hotlineData, userId, userRole = "admin") => {
    try {
      const newHotline = {
        agencyName: hotlineData.agencyName,
        contactNumber: hotlineData.contactNumber,
        description: hotlineData.description,
        addedBy: userId,
        createdAt: Timestamp.now(),
        isActive: true,
      };

      const docRef = await addDoc(
        collection(db, "emergencyHotlines"),
        newHotline
      );

      // Log the action
      await logHotlineCreation(
        docRef.id,
        hotlineData.agencyName,
        userId,
        userRole
      );

      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error creating hotline:", error);
      return { success: false, error: error.message };
    }
  };

  // Update existing hotline
  const updateHotline = async (
    hotlineId,
    hotlineData,
    userId,
    userRole = "admin"
  ) => {
    try {
      const hotlineRef = doc(db, "emergencyHotlines", hotlineId);
      await updateDoc(hotlineRef, {
        agencyName: hotlineData.agencyName,
        contactNumber: hotlineData.contactNumber,
        description: hotlineData.description,
        updatedAt: Timestamp.now(),
        updatedBy: userId,
      });

      // Log the action
      await logHotlineUpdate(
        hotlineId,
        hotlineData.agencyName,
        userId,
        userRole
      );

      return { success: true };
    } catch (error) {
      console.error("Error updating hotline:", error);
      return { success: false, error: error.message };
    }
  };

  // Deactivate hotline (soft delete)
  const deactivateHotline = async (hotlineId, userId, userRole = "admin") => {
    try {
      // Get the hotline data first for logging
      const hotlineToDeactivate = hotlines.find((h) => h.id === hotlineId);
      const hotlineName = hotlineToDeactivate
        ? hotlineToDeactivate.agencyName
        : "Unknown hotline";

      const hotlineRef = doc(db, "emergencyHotlines", hotlineId);
      await updateDoc(hotlineRef, {
        isActive: false,
        deactivatedAt: Timestamp.now(),
        deactivatedBy: userId,
      });

      // Log the action
      await logHotlineDeletion(hotlineId, hotlineName, userId, userRole);

      return { success: true };
    } catch (error) {
      console.error("Error deactivating hotline:", error);
      return { success: false, error: error.message };
    }
  };

  return {
    hotlines,
    loading,
    createHotline,
    updateHotline,
    deactivateHotline,
  };
}
