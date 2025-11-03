"use client";

export const FilterBar = ({
  statusFilter,
  onFilterChange,
  onRefresh,
  onToggleLegend,
}) => {
  return (
    <div className="filter-bar">
      <div className="filter-title">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
          <line x1="8" y1="2" x2="8" y2="18"></line>
          <line x1="16" y1="6" x2="16" y2="22"></line>
        </svg>
        <h2>Map View</h2>
      </div>

      <div className="filter-controls">
        <div className="filter-dropdown">
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => onFilterChange(e.target.value)}
          >
            <option value="all">All Reports</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <button className="filter-btn" onClick={onRefresh} title="Refresh Map">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
        </button>

        <button
          className="filter-btn"
          onClick={onToggleLegend}
          title="Toggle Legend"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
