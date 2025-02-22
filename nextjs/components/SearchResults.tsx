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
import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { Spinner } from '@heroui/spinner';
import { AaveUser, CompoundUser, UserTransaction } from '@/common/types';

interface SearchResultsProps {
  userAddress: string;
  protocol: string;
}

export default function UserSearchResults({
  userAddress,
  protocol,
}: SearchResultsProps) {
  const [page, setPage] = useState<number>(1);
  const rowsPerPage = 10; // UI pagination
  const transactionsPerQuery = 50; // Fetch in batches
  const skip = (page - 1) * transactionsPerQuery; // Fetching in batches of 50

  // Store all loaded transactions to avoid losing data
  const [allTransactions, setAllTransactions] = useState<UserTransaction[]>([]);

  const {
    data: transactions,
    isLoading,
    error: transactionError,
  } = useSWR(
    [userAddress, protocol, transactionsPerQuery, skip],
    ([searchQuery, protocol, first, skip]) =>
      fetchTransactionData(searchQuery, protocol, first, skip),
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        if (data?.baseTransactions) {
          setAllTransactions((prev) => {
            // Prevent duplicates
            const uniqueTransactions = [
              ...prev,
              ...data.baseTransactions.filter(
                (tx) => !prev.some((prevTx) => prevTx.id === tx.id)
              ),
            ];
            return uniqueTransactions;
          });
        }
      },
    }
  );

  const {
    data: dailyData,
    isLoading: isDailyStatsLoading,
    error: dailyStatsError,
  } = useQuery({
    queryKey: ['dailyStats', userAddress, protocol],
    queryFn: () => fetchDailyStats(userAddress, protocol), // Calls the server function
    enabled: !!userAddress && !!protocol, // Only fetch when userAddress exists
  });

  const {
    data: userData,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: ['userData', userAddress],
    queryFn: () => fetchUserData(userAddress), // Calls the server function
    enabled: !!userAddress, // Only fetch when userAddress exists
  });

  const userProtocol = useMemo(() => {
    return userData?.user[protocol === 'Aave' ? 'aave' : 'compound'];
  }, [userData, protocol]);

  // total pages calculation
  const totalPages = useMemo(() => {
    if (userProtocol?.totalTransactions) {
      return Math.ceil(Number(userProtocol.totalTransactions) / rowsPerPage);
    }
    return 1; // Default to 1 if no data is available
  }, [userData, rowsPerPage, userProtocol?.totalTransactions]);

  // Paginate transactions client-side from stored data
  const paginatedTransactions = useMemo(() => {
    return allTransactions.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  }, [allTransactions, page]);

  useEffect(() => {
    if (userError || dailyStatsError || transactionError) {
      setAllTransactions([]); // Clear previous transactions
    }
  }, [userError, dailyStatsError, transactionError]);

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

        {userError || dailyStatsError || transactionError ? (
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
        ) : (
          userProtocol &&
          dailyData &&
          transactions && (
            <motion.div
              key='data'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <TotalStatistics user={userProtocol as AaveUser | CompoundUser} />
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
          )
        )}
      </AnimatePresence>
    </div>
  );
}
