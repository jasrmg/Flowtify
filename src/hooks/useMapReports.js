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

/**
 * Hook for fetching map reports with different query options
 * @param {string} queryType - Type of query: "all", "pendingAndVerified", "verifiedOnly"
 */
export function useMapReports(queryType = "all") {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let reportsQuery;

    // Create different queries based on the queryType
    switch (queryType) {
      case "pendingAndVerified":
        // Original query - for components that need pending and verified only
        reportsQuery = query(
          collection(db, "reports"),
          where("status", "in", ["pending", "verified"]),
          orderBy("createdAt", "desc")
        );
        break;

      case "verifiedOnly":
        // Only verified reports
        reportsQuery = query(
          collection(db, "reports"),
          where("status", "==", "verified"),
          orderBy("createdAt", "desc")
        );
        break;

      case "all":
      default:
        // All reports - filtering by status will happen in the component
        reportsQuery = query(
          collection(db, "reports"),
          orderBy("createdAt", "desc")
        );
        break;
    }

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
            verifiedAt: data.verifiedAt,
            verifiedBy: data.verifiedBy,
            resolvedAt: data.resolvedAt,
            resolvedBy: data.resolvedBy,
            rejectedAt: data.rejectedAt,
            rejectedBy: data.rejectedBy,
            rejectionReason: data.rejectionReason,
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
  }, [queryType]);

  return { markers, loading };
}
