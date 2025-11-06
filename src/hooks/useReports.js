import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

export const useReports = (statusFilter = "pending") => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    let reportsQuery;

    if (statusFilter === "all") {
      reportsQuery = query(
        collection(db, "reports"),
        orderBy("createdAt", "desc")
      );
    } else {
      reportsQuery = query(
        collection(db, "reports"),
        where("status", "==", statusFilter),
        orderBy("createdAt", "desc")
      );
    }

    const unsubscribe = onSnapshot(
      reportsQuery,
      (snapshot) => {
        const reportsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReports(reportsData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching reports:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [statusFilter]);

  // Approve/Verify a report
  const approveReport = async (reportId, adminId) => {
    try {
      const reportRef = doc(db, "reports", reportId);
      await updateDoc(reportRef, {
        status: "verified",
        verifiedAt: Timestamp.now(),
        verifiedBy: adminId,
      });
      return { success: true };
    } catch (error) {
      console.error("Error approving report:", error);
      return { success: false, error: error.message };
    }
  };

  // Reject a report
  const rejectReport = async (reportId, adminId, reason = "") => {
    try {
      const reportRef = doc(db, "reports", reportId);
      await updateDoc(reportRef, {
        status: "rejected",
        rejectedAt: Timestamp.now(),
        rejectedBy: adminId,
        rejectionReason: reason,
      });
      return { success: true };
    } catch (error) {
      console.error("Error rejecting report:", error);
      return { success: false, error: error.message };
    }
  };

  // Delete a report
  const deleteReport = async (reportId) => {
    try {
      await deleteDoc(doc(db, "reports", reportId));
      return { success: true };
    } catch (error) {
      console.error("Error deleting report:", error);
      return { success: false, error: error.message };
    }
  };

  // Add admin comment to report
  const addComment = async (reportId, adminId, message) => {
    try {
      const reportRef = doc(db, "reports", reportId);
      await updateDoc(reportRef, {
        comments: arrayUnion({
          adminId,
          message,
          timestamp: Timestamp.now(),
        }),
      });
      return { success: true };
    } catch (error) {
      console.error("Error adding comment:", error);
      return { success: false, error: error.message };
    }
  };

  // Mark report as resolved
  const resolveReport = async (reportId, adminId) => {
    try {
      const reportRef = doc(db, "reports", reportId);
      await updateDoc(reportRef, {
        status: "resolved",
        resolvedAt: Timestamp.now(),
        resolvedBy: adminId,
      });
      return { success: true };
    } catch (error) {
      console.error("Error resolving report:", error);
      return { success: false, error: error.message };
    }
  };

  return {
    reports,
    loading,
    error,
    approveReport,
    rejectReport,
    deleteReport,
    addComment,
    resolveReport,
  };
};
