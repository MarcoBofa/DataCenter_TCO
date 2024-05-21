// components/PieChart.tsx
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface pieProps {
  serverCost: number;
  networkCost: number;
  buildingCost: number;
  energyCost: number;
  powerAndCoolingCost: number;
  softwareLicenseCost: number;
}

const PieChart: React.FC<pieProps> = ({
  serverCost,
  networkCost,
  buildingCost,
  energyCost,
  powerAndCoolingCost,
  softwareLicenseCost,
}) => {
  const data = {
    labels: [
      "Server Cost",
      "Network Cost",
      "Building Cost",
      "Energy Cost",
      "Power & Cooling Cost",
      "Software Cost",
    ],
    datasets: [
      {
        label: "Cost",
        data: [
          serverCost,
          networkCost,
          buildingCost,
          energyCost,
          powerAndCoolingCost,
          softwareLicenseCost,
        ],
        backgroundColor: [
          "rgba(40, 206, 40, 0.2)",
          "rgba(249, 115, 22 , 0.2)",
          "rgba(99, 102, 241 , 0.3)",
          "rgba(217, 70, 239, 0.2)",
          "rgba(34, 211, 238 , 0.3)",
          "rgba(251, 219, 91, 0.3)",
        ],
        borderColor: [
          "rgba(40, 206, 40, 1)",
          "rgba(249, 115, 22 , 1)",
          "rgba(99, 102, 241 , 1)",
          "rgba(217, 70, 239, 1)",
          "rgba(34, 211, 238 , 1)",
          "rgba(251, 191, 36 , 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          font: {
            size: 15, // Set the font size here
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce(
              (acc: number, curr: number) => acc + curr,
              0
            );
            const percentage = ((value / total) * 100).toFixed(0) + "%"; // Remove decimals
            const formattedValue =
              "$" +
              value.toLocaleString("en-US", {
                maximumFractionDigits: 0,
              }); // Add thousand separators
            return `${label}: ${formattedValue} (${percentage})`;
          },
        },
        titleFont: {
          size: 16, // Set the font size of the tooltip title
        },
        bodyFont: {
          size: 17, // Set the font size of the tooltip body
        },
      },
    },
  };

  return (
    <div className="w-[550px] h-[550px] text-xl">
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
