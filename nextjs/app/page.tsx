'use client';

import { CustomSearchbar } from '@/components/Searchbar';
import { useState } from 'react';
import { motion } from 'framer-motion';
import UserSearchResults from '@/components/SearchResults';

export default function Home() {
  const [moved, setMoved] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false); // Delay showing results

  const onSearch = (query: string) => {
    if (query !== '') {
      setSearchQuery(query);
      setMoved(true);

      // Delay results by 500ms
      setTimeout(() => {
        setShowResults(true);
      }, 500);
    }
  };

  return (
    <main className='flex flex-col items-center min-h-screen sm:p-20'>
      {/* Animated Search Bar */}
      <motion.div
        initial={{ top: '50%', translateY: '-50%' }} // Initially centered
        animate={{
          top: moved ? '0' : '50%', // Move to top when searched
          translateY: moved ? '0%' : '-50%',
        }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className='absolute w-3/4 p-4'
      >
        <CustomSearchbar onSearch={onSearch} />
      </motion.div>

      {/* Show Results with Delay */}
      {showResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className='rounded mt-10 p-2 border-gray-50 w-full'
        >
          <UserSearchResults searchQuery={searchQuery} />
        </motion.div>
      )}
    </main>
  );
}
