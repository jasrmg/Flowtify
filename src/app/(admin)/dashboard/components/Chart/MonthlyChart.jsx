import "./MonthlyChart.css";

export const MonthlyChart = ({ data }) => {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="chart-container">
      <h2>Monthly Report Trends</h2>
      <div className="simple-chart">
        {data.map((item, index) => {
          const heightPercentage = (item.value / maxValue) * 100;

          return (
            <div
              key={index}
              className="chart-bar"
              style={{ height: `${heightPercentage}%` }}
            >
              <div className="chart-bar-value">{item.value}</div>
              <div className="chart-bar-label">{item.month}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
