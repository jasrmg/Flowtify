import { formatDistanceToNow } from "date-fns";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export function getNotificationIcon(type) {
  switch (type) {
    case "report":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      );
    case "alert":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      );
    case "user":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="8.5" cy="7" r="4"></circle>
          <line x1="20" y1="8" x2="20" y2="14"></line>
          <line x1="23" y1="11" x2="17" y2="11"></line>
        </svg>
      );
    case "success":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      );
    default:
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      );
  }
}

export function getNotificationIconClass(type) {
  switch (type) {
    case "report":
      return "warning";
    case "alert":
      return "warning";
    case "user":
      return "info";
    case "success":
      return "success";
    default:
      return "info";
  }
}

export function formatNotificationTime(timestamp) {
  if (!timestamp) return "Just now";

  // Handle Firestore Timestamp
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

  try {
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return "Just now";
  }
}

// Create a notification for report status change
export async function createReportStatusNotification({
  reportId,
  userId,
  status, // 'approved', 'rejected' or 'resolved'
  reportDescription,
  location,
  rejectionReason = "",
}) {
  try {
    const notificationsRef = collection(db, "notifications");

    let title,
      body = "";
    if (status === "approved") {
      title = "Report Approved";
      body = `Your report for ${location} has been approved and is now visible to the community.`;
    } else if (status === "resolved") {
      title = "Report Resolved";
      body = `Your report for ${location} has been marked as resolved. Thank you for helping keep the community informed!`;
    } else {
      // rejected
      title = "Report Rejected";
      body = rejectionReason
        ? `Your report for ${location} was rejected. Reason: ${rejectionReason}`
        : `Your report for ${location} was rejected.`;
    }

    const notificationData = {
      title,
      body,
      type: "report",
      reportId,
      receiverId: userId,
      isRead: false,
      createdAt: serverTimestamp(),
    };

    console.log("Creating notification with data:", notificationData);

    await addDoc(notificationsRef, notificationData);
    return { success: true };
  } catch (error) {
    console.error("Error creating notification:", error);
    return { success: false, error: error.message };
  }
}
