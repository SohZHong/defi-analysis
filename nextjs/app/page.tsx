'use client';

import { CustomSearchbar } from '@/components/Searchbar';
import { useState } from 'react';
import { motion } from 'framer-motion';
import UserSearchResults from '@/components/SearchResults';
import { Spinner } from '@heroui/spinner';

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
    <main className='flex flex-col items-center min-h-screen'>
      {/* Animated Search Bar */}
      <motion.div
        initial={{ top: '50%', translateY: '-50%' }} // Initially centered
        animate={{
          top: moved ? '0' : '50%', // Move to top when searched
          translateY: moved ? '0%' : '-50%',
        }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className='absolute md:w-3/4 p-4'
      >
        <h1 className='font-bold text-3xl text-center mb-10'>
          DeFi Analytics Dashboard
        </h1>
        <CustomSearchbar onSearch={onSearch} />
      </motion.div>
      {/* Show Results with Delay */}
      {moved && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 50 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className='rounded lg:mt-32 md:mt-36 mt-40 lg:p-10 md:p-5 p-2 border-gray-50 w-full'
        >
          {showResults ? (
            <UserSearchResults searchQuery={searchQuery} />
          ) : (
            <div className='flex items-center w-full'>
              <Spinner color='secondary' size='lg' />
            </div>
          )}
        </motion.div>
      )}
    </main>
  );
}
