import { db } from "@/lib/firebase";
import { doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { createReportStatusNotification } from "./notificationHelpers";

// Format report date
export const formatReportDate = (timestamp) => {
  if (!timestamp) return "Unknown date";

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Format relative time
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "Unknown time";

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60)
    return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;

  return formatReportDate(timestamp);
};

// Format location from report data
export const formatLocation = (location) => {
  if (!location) return "Unknown location";

  if (typeof location === "string") return location;

  // If location is an object with brg and city
  const { brg, city } = location;
  if (brg && city) {
    return `Barangay ${brg}, ${city}`;
  }

  return "Unknown location";
};

// Get severity badge class
export const getSeverityClass = (severity) => {
  const severityMap = {
    low: "severity-low",
    medium: "severity-medium",
    high: "severity-high",
  };
  return severityMap[severity] || "severity-low";
};

// Get status badge class
export const getStatusClass = (status) => {
  const statusMap = {
    pending: "status-pending",
    verified: "status-verified",
    resolved: "status-resolved",
    rejected: "status-rejected",
  };
  return statusMap[status] || "status-pending";
};

// Format status text
export const formatStatus = (status) => {
  const statusMap = {
    pending: "Pending Review",
    verified: "Verified",
    resolved: "Resolved",
    rejected: "Rejected",
  };
  return statusMap[status] || status;
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Get reporter name (will need to fetch from users collection)
export const getReporterName = (userId) => {
  // This is a placeholder - in real implementation,
  // you'd fetch this from the users collection
  return userId ? "User " + userId.substring(0, 6) : "Anonymous";
};

// Approve a report
export async function approveReport(reportId, adminId, adminRole) {
  try {
    const reportRef = doc(db, "reports", reportId);

    // First, get the report data to extract userId and location
    const reportSnap = await getDoc(reportRef);
    if (!reportSnap.exists()) {
      return { success: false, error: "Report not found" };
    }

    const reportData = reportSnap.data();

    // Update report status
    await updateDoc(reportRef, {
      status: "verified",
      verifiedAt: serverTimestamp(),
      verifiedBy: adminId,
    });

    // Create notification for the report creator
    const location = formatLocation(reportData.location);
    await createReportStatusNotification({
      reportId,
      userId: reportData.userId,
      status: "approved",
      reportDescription: reportData.description,
      location,
    });

    return { success: true };
  } catch (error) {
    console.error("Error approving report:", error);
    return { success: false, error: error.message };
  }
}

// Reject a report
export async function rejectReport(
  reportId,
  adminId,
  adminRole,
  rejectionReason = ""
) {
  try {
    console.log("Rejecting report with reason:", rejectionReason); // Debug log

    const reportRef = doc(db, "reports", reportId);

    // First, get the report data to extract userId and location
    const reportSnap = await getDoc(reportRef);
    if (!reportSnap.exists()) {
      return { success: false, error: "Report not found" };
    }

    const reportData = reportSnap.data();

    // Prepare update data
    const updateData = {
      status: "rejected",
      rejectedAt: serverTimestamp(),
      rejectedBy: adminId,
      rejectionReason: rejectionReason?.trim() || "", // Trim whitespace
    };

    console.log("Update data:", updateData); // Debug log

    // Update report status
    await updateDoc(reportRef, updateData);

    // Create notification for the report creator
    const location = formatLocation(reportData.location);
    await createReportStatusNotification({
      reportId,
      userId: reportData.userId,
      status: "rejected",
      reportDescription: reportData.description,
      location,
      rejectionReason: rejectionReason?.trim() || "",
    });

    return { success: true };
  } catch (error) {
    console.error("Error rejecting report:", error);
    return { success: false, error: error.message };
  }
}
