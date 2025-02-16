'use client';

import {
  fetchDailyStats,
  fetchTransactionData,
  fetchUserData,
} from '@/utils/getRequestData';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import TotalStatistics from './TotalStatistics';
import TransactionTable from './TransactionTable';
import DailyStatsChart from './DailyStatsChart';
import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { Spinner } from '@heroui/spinner';

interface SearchResultsProps {
  searchQuery: string;
}

export default function UserSearchResults({ searchQuery }: SearchResultsProps) {
  // State Management for Transactions
  const [page, setPage] = useState(1);
  const rowsPerPage = 10; // UI pagination
  const transactionsPerQuery = 50; // Fetch in batches
  const skip = (page - 1) * rowsPerPage; // Skip for GraphQL

  // Fetch transactions with SWR
  const {
    data: transactions,
    isLoading,
    error: transactionError,
  } = useSWR(
    [searchQuery, transactionsPerQuery, skip],
    ([searchQuery, first, skip]) =>
      fetchTransactionData(searchQuery, first, skip),
    { keepPreviousData: true }
  );

  // Calculate total pages dynamically
  const totalPages = useMemo(() => {
    return transactions
      ? transactions?.baseTransactions.length > 0
        ? Math.ceil(transactions.baseTransactions.length / rowsPerPage)
        : 1
      : 1;
  }, [transactions]);

  // Paginate transactions client-side
  const paginatedTransactions = useMemo(() => {
    return (
      transactions?.baseTransactions.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
      ) || []
    );
  }, [transactions, page]);

  const {
    data: dailyData,
    isLoading: isDailyStatsLoading,
    error: dailyStatsError,
  } = useQuery({
    queryKey: ['dailyStats', searchQuery],
    queryFn: () => fetchDailyStats(searchQuery), // Calls the server function
    enabled: !!searchQuery, // Only fetch when searchQuery exists
  });

  const {
    data: userData,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: ['userData', searchQuery],
    queryFn: () => fetchUserData(searchQuery), // Calls the server function
    enabled: !!searchQuery, // Only fetch when searchQuery exists
  });

  return (
    <div className='w-full border border-lightgrey p-4 rounded-lg'>
      <AnimatePresence mode='wait'>
        {(isUserLoading || isDailyStatsLoading) && (
          <motion.div
            key='loading'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className='flex justify-center w-full'>
              <Spinner color='secondary' size='lg' />
            </div>
          </motion.div>
        )}

        {(userError || dailyStatsError || transactionError) && (
          <motion.p
            key='error'
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {userError
              ? userError.message
              : dailyStatsError
              ? dailyStatsError.message
              : transactionError.message}
          </motion.p>
        )}

        {!(isUserLoading || isDailyStatsLoading) &&
          !(userError || dailyStatsError) &&
          userData &&
          userData.user &&
          dailyData &&
          transactions && (
            <motion.div
              key='data'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <TotalStatistics user={userData.user} />
              <TransactionTable
                transactions={paginatedTransactions}
                isLoading={isLoading}
                page={page}
                totalPages={totalPages}
                setPage={setPage}
              />
              <DailyStatsChart
                dailyBorrowStats={dailyData.dailyBorrowStats_collection}
                dailyLiquidationStats={dailyData.dailyBorrowStats_collection}
                dailyRepayStats={dailyData.dailyRepayStats_collection}
                dailySupplyStats={dailyData.dailySupplyStats_collection}
                dailyWithdrawStats={dailyData.dailyWithdrawStats_collection}
              />
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}
