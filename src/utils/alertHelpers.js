import { formatDistanceToNow } from "date-fns";

export function getAlertClass(severity) {
  switch (severity) {
    case "high":
      return "alert-danger";
    case "medium":
      return "alert-warning";
    case "low":
      return "alert-info";
    default:
      return "alert-info";
  }
}

export function formatAlertTime(timestamp) {
  if (!timestamp) return "Just now";

  // Handle Firestore Timestamp
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

  try {
    // Check if it's within the last hour
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / 1000 / 60);

    if (diffInMinutes < 60) {
      return "Active now";
    }

    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return "Just now";
  }
}
