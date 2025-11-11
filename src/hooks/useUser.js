"use client";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Hook for fetching a single user by their UID
 * @param {string} userId - The user's UID
 */
export function useUser(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setUser(null);
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const userDoc = await getDoc(doc(db, "users", userId));

        if (userDoc.exists()) {
          setUser({
            uid: userDoc.id,
            ...userDoc.data(),
          });
        } else {
          setUser(null);
          setError("User not found");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading, error };
}
