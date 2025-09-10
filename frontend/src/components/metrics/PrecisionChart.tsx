import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, type ChartOptions } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export interface PrecisionData {
  p_at_5: number;
  p_at_10: number;
}

interface PrecisionChartProps {
  data: PrecisionData;
}

const PrecisionChart: React.FC<PrecisionChartProps> = ({ data }) => {
  const chartData = {
    labels: ["P@5", "P@10"],
    datasets: [
      {
        label: "Precision",
        data: [data.p_at_5, data.p_at_10],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",   // Green for P@5
          "rgba(101, 163, 13, 0.8)",  // Darker green for P@10
        ],
        borderColor: [
          "rgb(34, 197, 94)",
          "rgb(101, 163, 13)",
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
            return `${context.label}: ${(context.parsed.y * 100).toFixed(1)}%`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        grid: { color: "rgba(229, 231, 235, 0.5)" },
        ticks: {
          color: "#6b7280",
          callback: function (value) {
            return `${(Number(value) * 100)}%`;
          }
        },
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

export default PrecisionChart;