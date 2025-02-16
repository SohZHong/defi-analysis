import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import { DailyStats } from '@/utils/getRequestData';
import { ethers } from 'ethers';
import { convertTimestamp, convertEther } from '@/utils/parseUtils';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip
);

interface DailyStatsChartProps {
  dailyBorrowStats: DailyStats[];
  dailyLiquidationStats: DailyStats[];
  dailyRepayStats: DailyStats[];
  dailySupplyStats: DailyStats[];
  dailyWithdrawStats: DailyStats[];
}

const mapDailyStats = (stats: DailyStats[]) => {
  if (stats.length === 0) return [];
  return stats.map((stat) => ({
    date: convertTimestamp(stat.timestamp),
    total: convertEther(stat.total),
  }));
};

export default function DailyStatsChart({
  dailyBorrowStats,
  dailyLiquidationStats,
  dailyRepayStats,
  dailySupplyStats,
  dailyWithdrawStats,
}: DailyStatsChartProps) {
  const borrowData = mapDailyStats(dailyBorrowStats);
  const supplyData = mapDailyStats(dailySupplyStats);
  const withdrawData = mapDailyStats(dailyWithdrawStats);
  const liquidatedData = mapDailyStats(dailyLiquidationStats);
  const repayData = mapDailyStats(dailyRepayStats);

  // Ensure unique dates
  const labels = [
    ...new Set(
      [
        ...borrowData,
        ...supplyData,
        ...withdrawData,
        ...liquidatedData,
        ...repayData,
      ].map((d) => d.date)
    ),
  ];

  // Filter out empty datasets
  const filteredDataSets = [
    borrowData.length > 0
      ? {
          label: 'Total Borrowed',
          data: borrowData.map((d) => d.total),
          borderColor: '#8884d8',
          fill: false,
        }
      : null,
    supplyData.length > 0
      ? {
          label: 'Total Supplied',
          data: supplyData.map((d) => d.total),
          borderColor: '#82ca9d',
          fill: false,
        }
      : null,
    withdrawData.length > 0
      ? {
          label: 'Total Withdrawn',
          data: withdrawData.map((d) => d.total),
          borderColor: '#ffc658',
          fill: false,
        }
      : null,
    liquidatedData.length > 0
      ? {
          label: 'Total Liquidated',
          data: liquidatedData.map((d) => d.total),
          borderColor: '#ffc658',
          fill: false,
        }
      : null,
    repayData.length > 0
      ? {
          label: 'Total Repaid',
          data: repayData.map((d) => d.total),
          borderColor: '#58ff73',
          fill: false,
        }
      : null,
  ].filter(
    (
      dataset
    ): dataset is {
      label: string;
      data: string[];
      borderColor: string;
      fill: boolean;
    } => dataset !== null
  ); // Ensures correct dataset type

  const data = {
    labels,
    datasets: filteredDataSets,
  };

  return <Line data={data} />;
}
