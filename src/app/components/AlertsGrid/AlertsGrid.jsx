import "./AlertsGrid.css";

export const AlertsGrid = ({ alerts }) => {
  return (
    <div className="alerts-grid">
      {alerts.map((alert) => (
        <div key={alert.id} className={`alert-card severity-${alert.severity}`}>
          <div className="alert-header">
            <span className={`severity-badge severity-${alert.severity}`}>
              {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
            </span>
          </div>
          <h3 className="alert-title">{alert.title}</h3>
          <div className="alert-location">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {alert.location}
          </div>
          <div className="alert-time">{alert.time}</div>
        </div>
      ))}
    </div>
  );
};
