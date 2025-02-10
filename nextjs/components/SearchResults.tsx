"use client";

import { fetchData } from "@/utils/getRequestData";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

interface SearchResultsProps {
  searchQuery: string;
}

export default function SearchResults({ searchQuery }: SearchResultsProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["searchResults", searchQuery],
    queryFn: () => fetchData(searchQuery), // Calls the server function
    enabled: !!searchQuery, // Only fetch when searchQuery exists
  });

  return (
    <div className="w-full border border-lightgrey p-4 rounded mt-4">
      <h2 className="text-lg font-semibold">Search Results</h2>

      {/* Smooth Transitions using AnimatePresence */}
      <AnimatePresence mode="wait">
        {isLoading && (
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

        {error && (
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

        {!isLoading && !error && data && (
          <motion.pre
            key="data"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            {JSON.stringify(data, null, 2)}
          </motion.pre>
        )}
      </AnimatePresence>
    </div>
  );
}