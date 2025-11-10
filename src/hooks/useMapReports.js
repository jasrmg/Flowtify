"use client";
import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useMapReports() {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Query reports with status 'pending' or 'verified'
    const reportsQuery = query(
      collection(db, "reports"),
      where("status", "in", ["pending", "verified"]),
      orderBy("createdAt", "desc")
    );

    // Real-time listener
    const unsubscribe = onSnapshot(
      reportsQuery,
      (snapshot) => {
        const reportsData = snapshot.docs.map((doc) => {
          const data = doc.data();

          const brg = data.location?.brg || "";
          const city = data.location?.city || "";

          let location = "";
          if (brg && city) {
            location = `${brg}, ${city}`;
          } else if (brg) {
            location = brg;
          } else if (city) {
            location = city;
          } else {
            location = "Unknown Location";
          }

          // Transform Firestore data to marker format
          return {
            id: doc.id,
            lat: data.location?.lat,
            lng: data.location?.lng,
            location,
            description: data.description,
            fullDescription: data.description,
            photo: data.photoUrl || [],
            status: data.status,
            severity: data.severity,
            createdAt: data.createdAt,
            userId: data.userId,
            brg: data.location?.brg,
            city: data.location?.city,
          };
        });

        // Filter out any reports without valid coordinates
        const validMarkers = reportsData.filter(
          (marker) => marker.lat && marker.lng
        );

        setMarkers(validMarkers);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching map reports:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { markers, loading };
}
