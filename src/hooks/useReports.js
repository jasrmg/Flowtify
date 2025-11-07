import { useState, useEffect } from "react";
import {
  logReportApproval,
  logReportRejection,
  logReportDeletion,
  logReportResolution,
} from "@/utils/systemLogger";
import { formatLocation } from "@/utils/reportHelpers";

import { createReportStatusNotification } from "@/utils/notificationHelpers";

import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const useReports = (statusFilter = "pending") => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe;

    const fetchReports = async () => {
      setLoading(true);

      try {
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

        unsubscribe = onSnapshot(
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
      } catch (error) {
        console.error("Error setting up listener:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchReports();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [statusFilter]);

  // Approve/Verify a report
  const approveReport = async (reportId, adminId, adminRole = "admin") => {
    try {
      // Get the report data first for logging
      const reportToApprove = reports.find((r) => r.id === reportId);
      const reportLocation = reportToApprove
        ? formatLocation(reportToApprove.location)
        : "Unknown location";

      const reportRef = doc(db, "reports", reportId);
      await updateDoc(reportRef, {
        status: "verified",
        verifiedAt: Timestamp.now(),
        verifiedBy: adminId,
      });

      // Log the action
      await logReportApproval(reportId, reportLocation, adminId, adminRole);

      // Create notification for the report creator
      if (reportToApprove) {
        console.log(
          "Creating notification for userId:",
          reportToApprove.userId
        );
        await createReportStatusNotification({
          reportId,
          userId: reportToApprove.userId,
          status: "approved",
          reportDescription: reportToApprove.description,
          location: reportLocation,
        });
      }

      return { success: true };
    } catch (error) {
      console.error("Error approving report:", error);
      return { success: false, error: error.message };
    }
  };

  // Reject a report
  const rejectReport = async (
    reportId,
    adminId,
    adminRole = "admin",
    reason = ""
  ) => {
    try {
      // Get the report data first for logging
      const reportToReject = reports.find((r) => r.id === reportId);
      const reportLocation = reportToReject
        ? formatLocation(reportToReject.location)
        : "Unknown location";

      const reportRef = doc(db, "reports", reportId);
      await updateDoc(reportRef, {
        status: "rejected",
        rejectedAt: Timestamp.now(),
        rejectedBy: adminId,
        rejectionReason: reason,
      });

      // Log the action
      await logReportRejection(reportId, reportLocation, adminId, adminRole);

      // Create notification for the report creator
      if (reportToReject) {
        console.log("Creating notification for userId:", reportToReject.userId);
        await createReportStatusNotification({
          reportId,
          userId: reportToReject.userId,
          status: "rejected",
          reportDescription: reportToReject.description,
          location: reportLocation,
          rejectionReason: reason,
        });
      }

      return { success: true };
    } catch (error) {
      console.error("Error rejecting report:", error);
      return { success: false, error: error.message };
    }
  };

  // Delete a report
  const deleteReport = async (reportId, adminId, adminRole = "admin") => {
    try {
      // Get the report data first for logging
      const reportToDelete = reports.find((r) => r.id === reportId);
      const reportLocation = reportToDelete
        ? formatLocation(reportToDelete.location)
        : "Unknown location";

      await deleteDoc(doc(db, "reports", reportId));

      // Log the action
      await logReportDeletion(reportId, reportLocation, adminId, adminRole);

      return { success: true };
    } catch (error) {
      console.error("Error deleting report:", error);
      return { success: false, error: error.message };
    }
  };

  // Mark report as resolved
  const resolveReport = async (reportId, adminId, adminRole = "admin") => {
    try {
      // Get the report data first for logging
      const reportToResolve = reports.find((r) => r.id === reportId);
      const reportLocation = reportToResolve
        ? formatLocation(reportToResolve.location)
        : "Unknown location";

      const reportRef = doc(db, "reports", reportId);
      await updateDoc(reportRef, {
        status: "resolved",
        resolvedAt: Timestamp.now(),
        resolvedBy: adminId,
      });

      // Log the action
      await logReportResolution(reportId, reportLocation, adminId, adminRole);

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
    resolveReport,
  };
};
