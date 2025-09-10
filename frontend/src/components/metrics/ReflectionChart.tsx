import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export interface ReflectionScores {
  ISREL: number[];
  ISSUP: number[];
  ISUSE: number[];
}

interface ReflectionChartProps {
  data: ReflectionScores;
}

/**
 * ReflectionChart visualizes ISREL, ISSUP, ISUSE scores over time as line charts.
 * Uses theme colors via Tailwind classes.
 */
const ReflectionChart: React.FC<ReflectionChartProps> = ({ data }) => {
  const chartData = {
    labels: data.ISREL.map((_, i) => `T${i + 1}`),
    datasets: [
      {
        label: "ISREL",
        data: data.ISREL,
        borderColor: "#2563eb", // primary
        backgroundColor: "#2563eb22",
        tension: 0.4,
        pointRadius: 4,
      },
      {
        label: "ISSUP",
        data: data.ISSUP,
        borderColor: "#f59e42", // accent
        backgroundColor: "#f59e4222",
        tension: 0.4,
        pointRadius: 4,
      },
      {
        label: "ISUSE",
        data: data.ISUSE,
        borderColor: "#64748b", // muted
        backgroundColor: "#64748b22",
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true as const, position: "top" as const },
      title: { display: false as const },
      tooltip: { enabled: true as const },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          color: "#1e293b",
          // Chart.js expects: (tickValue: number | string, index: number, ticks: Tick[]) => string | number | ...
          callback: function(tickValue: number | string) {
            if (typeof tickValue === "number") {
              return `${Math.round(tickValue * 100)}%`;
            }
            return tickValue;
          }
        },
        grid: { color: "#e0e7ef" },
      },
      x: {
        ticks: { color: "#1e293b" },
        grid: { color: "#e0e7ef" },
      },
    },
  };

  return (
  <div className="bg-card rounded-xl p-4 shadow h-64 md:h-128 min-h-[16em] flex items-center justify-center w-full overflow-hidden">
      {/*
        Chart container uses fixed height (h-64, min-h-[16rem]) to prevent Chart.js flickering/shrinking.
        Flex centering ensures chart is always visible and stable.
      */}
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ReflectionChart;
