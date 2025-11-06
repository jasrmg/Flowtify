// Determine log type based on action
export const getLogType = (action) => {
  const actionLower = action?.toLowerCase() || "";

  if (
    actionLower.includes("delete") ||
    actionLower.includes("reject") ||
    actionLower.includes("deactivate")
  ) {
    return "error";
  }

  if (
    actionLower.includes("approve") ||
    actionLower.includes("create") ||
    actionLower.includes("add")
  ) {
    return "success";
  }

  if (
    actionLower.includes("update") ||
    actionLower.includes("edit") ||
    actionLower.includes("modify")
  ) {
    return "warning";
  }

  return "info";
};

// Format timestamp to readable string
export const formatLogTime = (timestamp) => {
  if (!timestamp) return "Unknown time";

  // Handle Firestore Timestamp
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

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

// Format log message
export const formatLogMessage = (log) => {
  const action = log.action || "Unknown action";
  const description = log.description || "";
  const targetCollection = log.targetCollection || "";

  if (description) {
    return description;
  }

  if (targetCollection) {
    return `${action} in ${targetCollection}`;
  }

  return action;
};
