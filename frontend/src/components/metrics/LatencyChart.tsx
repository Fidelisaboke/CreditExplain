import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, type ChartOptions } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
        backgroundColor: [
          "rgba(101, 163, 255, 0.8)",   // Min - lighter blue
          "rgba(66, 138, 245, 0.8)",    // P50
          "rgba(37, 99, 235, 0.8)",     // P75 - primary blue
          "rgba(29, 78, 216, 0.8)",     // P90
          "rgba(30, 64, 175, 0.8)",     // P99
          "rgba(37, 99, 235, 0.8)",     // Avg - primary blue
          "rgba(30, 58, 138, 0.8)",     // Max - darker blue
        ],
        borderColor: [
          "rgb(101, 163, 255)",
          "rgb(66, 138, 245)",
          "rgb(37, 99, 235)",
          "rgb(29, 78, 216)",
          "rgb(30, 64, 175)",
          "rgb(37, 99, 235)",
          "rgb(30, 58, 138)",
        ],
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#1f2937",
        bodyColor: "#374151",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y} ms`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(229, 231, 235, 0.5)" },
        ticks: { color: "#6b7280" },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#6b7280" },
      },
    },
  };

  return (
    <div className="h-80">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default LatencyChart;