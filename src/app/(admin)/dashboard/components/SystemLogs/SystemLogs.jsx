import "./SystemLogs.css";
import {
  getLogType,
  formatLogTime,
  formatLogMessage,
} from "@/utils/logHelpers";

const getLogIcon = (type) => {
  const icons = {
    info: (
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
    ),
    success: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    ),
    warning: (
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
    ),
    error: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
    ),
  };
  return icons[type] || icons.info;
};

export const SystemLogs = ({ logs, loading }) => {
  if (loading) {
    return (
      <div className="logs-container">
        <div className="logs-loading">
          <div className="loading-spinner"></div>
          <p>Loading system logs...</p>
        </div>
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="logs-container">
        <div className="logs-empty">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="12" y1="18" x2="12" y2="12"></line>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
          <p>No system logs available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="logs-container">
      <div className="log-list" id="logList">
        {logs.map((log) => {
          const logType = getLogType(log.action);
          const logMessage = formatLogMessage(log);
          const logTime = formatLogTime(log.timestamp);

          return (
            <div key={log.id} className="log-item">
              <div className={`log-icon ${logType}`}>{getLogIcon(logType)}</div>
              <div className="log-content">
                <div className="log-message">{logMessage}</div>
                <div className="log-time">{logTime}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
