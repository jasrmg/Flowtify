import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

/**
 * Log an action to the systemLogs collection
 * @param {Object} logData - The log data
 * @param {string} logData.action - The action performed (e.g., "Report Approved", "Alert Created")
 * @param {string} logData.description - Detailed description of the action
 * @param {string} logData.targetCollection - The collection being acted upon
 * @param {string} logData.targetId - The document ID being acted upon
 * @param {string} logData.userId - The user who performed the action
 * @param {string} logData.userRole - The role of the user (e.g., "admin", "user")
 */
export const logSystemAction = async (logData) => {
  try {
    const {
      action,
      description,
      targetCollection,
      targetId,
      userId,
      userRole,
    } = logData;

    await addDoc(collection(db, "systemLogs"), {
      action,
      description,
      targetCollection,
      targetId,
      userId,
      userRole,
      timestamp: Timestamp.now(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error logging system action:", error);
    return { success: false, error: error.message };
  }
};

// Helper functions for common actions

export const logReportApproval = async (
  reportId,
  reportLocation,
  userId,
  userRole
) => {
  return await logSystemAction({
    action: "Report Approved",
    description: `Admin approved a flood report from ${reportLocation}`,
    targetCollection: "reports",
    targetId: reportId,
    userId,
    userRole,
  });
};

export const logReportRejection = async (
  reportId,
  reportLocation,
  userId,
  userRole
) => {
  return await logSystemAction({
    action: "Report Rejected",
    description: `Admin rejected a flood report from ${reportLocation}`,
    targetCollection: "reports",
    targetId: reportId,
    userId,
    userRole,
  });
};

export const logReportDeletion = async (
  reportId,
  reportLocation,
  userId,
  userRole
) => {
  return await logSystemAction({
    action: "Report Deleted",
    description: `Admin deleted a flood report from ${reportLocation}`,
    targetCollection: "reports",
    targetId: reportId,
    userId,
    userRole,
  });
};

export const logReportResolution = async (
  reportId,
  reportLocation,
  userId,
  userRole
) => {
  return await logSystemAction({
    action: "Report Resolved",
    description: `Admin marked a flood report as resolved for ${reportLocation}`,
    targetCollection: "reports",
    targetId: reportId,
    userId,
    userRole,
  });
};

export const logAlertCreation = async (
  alertId,
  alertTitle,
  userId,
  userRole
) => {
  return await logSystemAction({
    action: "Alert Created",
    description: `Admin created a new alert: "${alertTitle}"`,
    targetCollection: "alerts",
    targetId: alertId,
    userId,
    userRole,
  });
};

export const logAlertDeactivation = async (
  alertId,
  alertTitle,
  userId,
  userRole
) => {
  return await logSystemAction({
    action: "Alert Deactivated",
    description: `Admin deactivated alert: "${alertTitle}"`,
    targetCollection: "alerts",
    targetId: alertId,
    userId,
    userRole,
  });
};

export const logUserAction = async (
  action,
  description,
  targetId,
  userId,
  userRole
) => {
  return await logSystemAction({
    action,
    description,
    targetCollection: "users",
    targetId,
    userId,
    userRole,
  });
};

export const logHotlineCreation = async (
  hotlineId,
  hotlineName,
  userId,
  userRole
) => {
  return await logSystemAction({
    action: "Hotline Added",
    description: `Admin added a new emergency hotline: "${hotlineName}"`,
    targetCollection: "hotlines",
    targetId: hotlineId,
    userId,
    userRole,
  });
};

export const logHotlineUpdate = async (
  hotlineId,
  hotlineName,
  userId,
  userRole
) => {
  return await logSystemAction({
    action: "Hotline Updated",
    description: `Admin updated emergency hotline: "${hotlineName}"`,
    targetCollection: "hotlines",
    targetId: hotlineId,
    userId,
    userRole,
  });
};

export const logHotlineDeletion = async (
  hotlineId,
  hotlineName,
  userId,
  userRole
) => {
  return await logSystemAction({
    action: "Hotline Deleted",
    description: `Admin deleted emergency hotline: "${hotlineName}"`,
    targetCollection: "hotlines",
    targetId: hotlineId,
    userId,
    userRole,
  });
};
