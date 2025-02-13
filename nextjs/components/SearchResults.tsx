"use client";

import { fetchDailyStats, fetchData } from "@/utils/getRequestData";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import TotalStatistics from "./TotalStatistics";
import TransactionTable from "./TransactionTable";
import DailyStatsChart from "./DailyStatsChart";

interface SearchResultsProps {
  searchQuery: string;
}

export default function SearchResults({ searchQuery }: SearchResultsProps) {
  const {
    data: dailyData,
    isLoading: isDailyStatsLoading,
    error: dailyStatsError,
  } = useQuery({
    queryKey: ["userData", searchQuery],
    queryFn: () => fetchDailyStats(searchQuery), // Calls the server function
    enabled: !!searchQuery, // Only fetch when searchQuery exists
  });
  console.log(dailyData);

  const {
    data: userData,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: ["dailyStats", searchQuery],
    queryFn: () => fetchData(searchQuery), // Calls the server function
    enabled: !!searchQuery, // Only fetch when searchQuery exists
  });

  return (
    <div className="w-full border border-lightgrey p-4 rounded mt-4">
      <h2 className="text-2xl font-semibold lg:mb-6 mb-2 underline">
        Search Results
      </h2>

      <AnimatePresence mode="wait">
        {(isUserLoading || isDailyStatsLoading) && (
          <motion.p
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            Loading...
          </motion.p>
        )}

        {(userError || dailyStatsError) && (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            Error loading data
          </motion.p>
        )}

        {!(isUserLoading || isDailyStatsLoading) &&
          !(userError || dailyStatsError) &&
          userData &&
          userData.user &&
          dailyData && (
            <motion.pre
              key="data"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <TotalStatistics user={userData.user} />
              <TransactionTable transactions={userData.user.transactions} />
              <DailyStatsChart
                dailyBorrowStats={dailyData.dailyBorrowStats_collection}
                dailyLiquidationStats={dailyData.dailyBorrowStats_collection}
                dailyRepayStats={dailyData.dailyRepayStats_collection}
                dailySupplyStats={dailyData.dailySupplyStats_collection}
                dailyWithdrawStats={dailyData.dailyWithdrawStats_collection}
              />
            </motion.pre>
          )}
      </AnimatePresence>
    </div>
  );
}
