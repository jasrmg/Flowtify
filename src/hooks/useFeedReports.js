import { useState, useEffect, useCallback, useMemo } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  Timestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const useFeedReports = (
  userLocation,
  pageSize = 10,
  searchTerm = ""
) => {
  const [allReports, setAllReports] = useState([]); // Store all fetched reports
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const fetchReports = useCallback(
    async (isInitial = false) => {
      if (!userLocation?.lat || !userLocation?.lng) {
        setLoading(false);
        return;
      }

      if (isInitial) {
        setLoading(true);
      } else {
        setIsFetchingMore(true);
      }

      try {
        const now = Timestamp.now();
        const twentyFourHoursAgo = Timestamp.fromMillis(
          now.toMillis() - 24 * 60 * 60 * 1000
        );

        // Build query for unresolved reports OR resolved within 24 hours
        let reportsQuery = query(
          collection(db, "reports"),
          where("status", "in", ["verified", "resolved"]),
          orderBy("createdAt", "desc"),
          limit(pageSize)
        );

        // If not initial load, start after last document
        if (!isInitial && lastDoc) {
          reportsQuery = query(
            collection(db, "reports"),
            where("status", "in", ["verified", "resolved"]),
            orderBy("createdAt", "desc"),
            startAfter(lastDoc),
            limit(pageSize)
          );
        }

        const snapshot = await getDocs(reportsQuery);

        if (snapshot.empty) {
          setHasMore(false);
          setLoading(false);
          return;
        }

        const reportsWithoutUserData = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((report) => {
            // Filter out resolved reports older than 24 hours
            if (report.status === "resolved") {
              const resolvedAt = report.resolvedAt;
              if (
                resolvedAt &&
                resolvedAt.toMillis() < twentyFourHoursAgo.toMillis()
              ) {
                return false;
              }
            }
            return true;
          });
        // Fetch all unique user IDs
        const userIds = [
          ...new Set(
            reportsWithoutUserData.map((r) => r.userId).filter(Boolean)
          ),
        ];

        // Fetch user data for all reporters
        const usersData = {};
        await Promise.all(
          userIds.map(async (userId) => {
            try {
              const userDoc = await getDoc(doc(db, "users", userId));
              if (userDoc.exists()) {
                const userData = userDoc.data();
                usersData[
                  userId
                ] = `${userData.firstName} ${userData.lastName}`;
              }
            } catch (error) {
              console.error("Error fetching user:", error);
            }
          })
        );

        const fetchedReports = reportsWithoutUserData
          .map((report) => {
            // Calculate distance from user location
            const distance = calculateDistance(
              userLocation.lat,
              userLocation.lng,
              report.location.lat,
              report.location.lng
            );
            return {
              ...report,
              distance,
              reporterName: usersData[report.userId] || "John Doe",
            };
          })
          .sort((a, b) => {
            // Sort by distance first, then by creation date
            if (Math.abs(a.distance - b.distance) < 0.1) {
              return b.createdAt.toMillis() - a.createdAt.toMillis();
            }
            return a.distance - b.distance;
          });

        // Update last document for pagination
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

        // Check if there are more documents
        // If we got fewer reports than pageSize, there are no more
        setHasMore(fetchedReports.length === pageSize);

        // Append or replace reports
        if (isInitial) {
          setAllReports(fetchedReports);
        } else {
          setAllReports((prev) => [...prev, ...fetchedReports]);
        }

        if (isInitial) {
          setLoading(false);
        } else {
          setIsFetchingMore(false);
        }
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError(err.message);
        if (isInitial) {
          setLoading(false);
        } else {
          setIsFetchingMore(false);
        }
      }
    },
    [userLocation, pageSize, lastDoc]
  );

  // Initial fetch
  useEffect(() => {
    setAllReports([]);
    setLastDoc(null);
    setHasMore(true);
    fetchReports(true);
  }, [userLocation, pageSize]);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchReports(false);
    }
  };

  // Filter reports based on search term
  const filteredReports = useMemo(() => {
    if (!searchTerm || searchTerm.trim() === "") {
      return allReports;
    }

    const searchLower = searchTerm.toLowerCase().trim();

    return allReports.filter((report) => {
      const barangay = report.location?.brg?.toLowerCase() || "";
      const city = report.location?.city?.toLowerCase() || "";
      const reporterName = report.reporterName?.toLowerCase() || "";

      return (
        barangay.includes(searchLower) ||
        city.includes(searchLower) ||
        reporterName.includes(searchLower)
      );
    });
  }, [allReports, searchTerm]);

  return {
    reports: filteredReports,
    loading,
    isFetchingMore,
    error,
    hasMore,
    loadMore,
  };
};
