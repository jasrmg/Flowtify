"use client";
import { useState, useEffect } from "react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase";

export function useEmergencyHotlines() {
  const [hotlines, setHotlines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Query hotlines ordered by creation date
    const hotlinesQuery = query(
      collection(db, "emergencyHotlines"),
      orderBy("createdAt", "desc")
    );

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
  }, []);

  return { hotlines, loading };
}
