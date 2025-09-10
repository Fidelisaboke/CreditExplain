import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export interface PrecisionData {
  p_at_5: number;
  p_at_10: number;
}

interface PrecisionChartProps {
  data: PrecisionData;
}

/**
 * PrecisionChart visualizes citation precision at 5 and 10 as a bar chart.
 * Uses theme colors via Tailwind classes.
 */
const PrecisionChart: React.FC<PrecisionChartProps> = ({ data }) => {
  const chartData = {
    labels: ["P@5", "P@10"],
    datasets: [
      {
        label: "Precision",
        data: [data.p_at_5, data.p_at_10],
        backgroundColor: ["#f59e42", "#2563eb"], // Tailwind accent & primary
        borderColor: ["#f59e42", "#2563eb"],
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false as const },
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
  <div className="bg-card rounded-xl p-4 shadow h-64 min-h-[16rem] flex items-center justify-center w-full overflow-hidden">
      {/*
        Chart container uses fixed height (h-64, min-h-[16rem]) to prevent Chart.js flickering/shrinking.
        Flex centering ensures chart is always visible and stable.
      */}
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default PrecisionChart;
