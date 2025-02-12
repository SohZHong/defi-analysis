import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { DailyStats, DailyStatsSearchResults } from "@/utils/getRequestData";
import { ethers } from "ethers";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip
);

interface DailyStatsChartProps {
  dailyStats: DailyStats[];
}

export default function DailyStatsChart({ dailyStats }: DailyStatsChartProps) {
  const chartData = dailyStats.map((dailyStat) => {
    console.log(dailyStat.timestamp);
    const convertedTimestamp = new Date(Number(dailyStat.timestamp) / 1_000);
    console.log(convertedTimestamp);
    const formattedDate = convertedTimestamp.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    console.log(formattedDate)
    return {
      date: formattedDate,
      totalBorrowed: ethers.formatEther(BigInt(dailyStat.totalBorrowed)),
      totalSupplied: ethers.formatEther(BigInt(dailyStat.totalSupplied)),
      totalWithdrawn: ethers.formatEther(BigInt(dailyStat.totalWithdrawn)),
    };
  })

  const data = {
    labels: chartData.map((d) => d.date),
    datasets: [
      {
        label: "Total Borrowed",
        data: chartData.map((d) => d.totalBorrowed),
        borderColor: "#8884d8",
        fill: false,
      },
      {
        label: "Total Supplied",
        data: chartData.map((d) => d.totalSupplied),
        borderColor: "#82ca9d",
        fill: false,
      },
      {
        label: "Total Withdrawn",
        data: chartData.map((d) => d.totalWithdrawn),
        borderColor: "#ffc658",
        fill: false,
      },
    ],
  };

  return <Line data={data} />;
}
