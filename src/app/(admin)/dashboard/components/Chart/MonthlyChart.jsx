import "./MonthlyChart.css";

export const MonthlyChart = ({ data, loading = false }) => {
  const maxValue =
    data && data.length > 0 ? Math.max(...data.map((d) => d.value)) : 0;

  return (
    <div className="chart-container">
      <h2>Monthly Report Trends</h2>

      {loading ? (
        <div className="chart-loading">
          <div className="simple-chart">
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <div
                key={index}
                className="chart-bar loading-shimmer"
                style={{ height: `${Math.random() * 60 + 40}%` }}
              ></div>
            ))}
          </div>
        </div>
      ) : data && data.length > 0 ? (
        <div className="simple-chart">
          {data.map((item, index) => {
            const heightPercentage =
              maxValue > 0 ? (item.value / maxValue) * 100 : 0;

            return (
              <div
                key={index}
                className="chart-bar"
                style={{ height: `${Math.max(heightPercentage, 5)}%` }}
              >
                <div className="chart-bar-value">{item.value}</div>
                <div className="chart-bar-label">{item.month}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="chart-empty">
          <p>No data available</p>
        </div>
      )}
    </div>
  );
};
