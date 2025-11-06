import "./StatCard.css";
export const StatCard = ({
  title,
  value,
  change,
  changeType,
  period,
  icon,
  iconType,
  loading = false,
}) => {
  return (
    <div className="stat-card">
      {loading ? (
        <>
          <div className={`stat-icon ${iconType} loading-shimmer`}></div>
          <div className="stat-content">
            <div className="loading-shimmer loading-text-sm"></div>
            <div className="loading-shimmer loading-text-lg"></div>
            <div className="loading-shimmer loading-text-xs"></div>
          </div>
        </>
      ) : (
        <>
          <div className={`stat-icon ${iconType}`}>{icon}</div>
          <div className="stat-content">
            <h3>{title}</h3>
            <div className="stat-number">{value}</div>
            <div className={`stat-change ${changeType}`}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {changeType === "positive" ? (
                  <polyline points="18 15 12 9 6 15"></polyline>
                ) : (
                  <polyline points="6 9 12 15 18 9"></polyline>
                )}
              </svg>
              <span>
                {change} {period}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
