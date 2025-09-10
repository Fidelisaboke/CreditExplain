import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title, Tooltip, Legend, type ChartOptions
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export interface ReflectionScores {
  ISREL: number[];
  ISSUP: number[];
  ISUSE: number[];
}

interface ReflectionChartProps {
  data: ReflectionScores;
}

const ReflectionChart: React.FC<ReflectionChartProps> = ({ data }) => {
  const chartData = {
    labels: data.ISREL.map((_, i) => `Query ${i + 1}`),
    datasets: [
      {
        label: "ISREL (Relevance)",
        data: data.ISREL,
        borderColor: "rgb(37, 99, 235)", // blue-600
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        tension: 0.3,
        pointBackgroundColor: "rgb(37, 99, 235)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(37, 99, 235)",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "ISSUP (Support)",
        data: data.ISSUP,
        borderColor: "rgb(234, 88, 12)", // orange-600
        backgroundColor: "rgba(234, 88, 12, 0.1)",
        tension: 0.3,
        pointBackgroundColor: "rgb(234, 88, 12)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(234, 88, 12)",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "ISUSE (Usefulness)",
        data: data.ISUSE,
        borderColor: "rgb(139, 92, 246)", // purple-500
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        tension: 0.3,
        pointBackgroundColor: "rgb(139, 92, 246)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(139, 92, 246)",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#374151",
          usePointStyle: true,
          padding: 20,
        }
      },
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
            return `${context.dataset.label}: ${(context.parsed.y * 100).toFixed(1)}%`;
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
        grid: { color: "rgba(229, 231, 235, 0.5)" },
        ticks: { color: "#6b7280" },
      },
    },
  };

  return (
    <div className="h-96">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ReflectionChart;