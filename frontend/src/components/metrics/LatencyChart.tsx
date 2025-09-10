import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export interface LatencyData {
  min_ms: number;
  avg_ms: number;
  max_ms: number;
  percentile_ms: {
    p50: number;
    p75: number;
    p90: number;
    p99: number;
  };
}

interface LatencyChartProps {
  data: LatencyData;
}

/**
 * LatencyChart visualizes latency metrics (min, avg, max, percentiles) as a bar chart.
 * Uses theme colors via Tailwind classes.
 */
const LatencyChart: React.FC<LatencyChartProps> = ({ data }) => {
  const chartData = {
    labels: ["Min", "P50", "P75", "P90", "P99", "Avg", "Max"],
    datasets: [
      {
        label: "Latency (ms)",
        data: [
          data.min_ms,
          data.percentile_ms.p50,
          data.percentile_ms.p75,
          data.percentile_ms.p90,
          data.percentile_ms.p99,
          data.avg_ms,
          data.max_ms,
        ],
        backgroundColor: "#2563eb", // Tailwind bg-primary
        borderColor: "#2563eb",
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#1e293b" }, // Tailwind text-foreground
        grid: { color: "#e0e7ef" }, // Tailwind border
      },
      x: {
        ticks: { color: "#1e293b" },
        grid: { color: "#e0e7ef" },
      },
    },
  };

  return (
  <div className="bg-card rounded-xl p-4 shadow h-64 min-h-[16rem] flex items-center justify-center w-full overflow-hidden">
      {/*
        Chart container uses fixed height (h-64, min-h-[16rem]) to prevent Chart.js flickering/shrinking.
        Flex centering ensures chart is always visible and stable.
      */}
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LatencyChart;
