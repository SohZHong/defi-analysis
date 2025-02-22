'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import UserSearchResults from '@/components/SearchResults';
import { Spinner } from '@heroui/spinner';
import { Select, SelectItem } from '@heroui/select';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import SearchIcon from '@/components/SearchIcon';
import { protocols } from '@/common/constants';

export default function Home() {
  const [moved, setMoved] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [protocol, setProtocol] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchProtocol, setSearchProtocol] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchProtocol(e.target.value);
  };

  const handleSearch = () => {
    if (searchQuery !== '' && searchProtocol !== '') {
      setWalletAddress(searchQuery);
      setProtocol(searchProtocol);
      setMoved(true);
      // Delay results by 500ms
      setTimeout(() => {
        setShowResults(true);
      }, 500);
    }
  };

  return (
    <main className='flex flex-col items-center min-h-screen py-10 transition-all duration-500'>
      {/* Animated Search Bar with Dynamic Margin */}
      <motion.div
        initial={{ marginTop: '16rem' }} // Start lower
        animate={{ marginTop: moved ? '0rem' : '16rem' }} // Move up when searched
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className='w-full md:w-4/5 p-4'
      >
        <h1 className='font-bold text-3xl text-center mb-10'>
          DeFi Analytics Dashboard
        </h1>
        <div className='flex w-full flex-col flex-wrap md:flex-nowrap gap-4'>
          <Input
            isRequired
            isClearable
            label='Wallet Address'
            type='text'
            variant='bordered'
            onInput={(e) => setSearchQuery(e.currentTarget.value)}
            onKeyDown={handleSearch}
          />
          <div className='justify-between flex gap-4'>
            <Select
              isRequired
              className='max-w-52'
              label='Select a protocol'
              variant='bordered'
              selectedKeys={[searchProtocol]}
              onChange={handleSelectionChange}
            >
              {protocols.map((protocol) => (
                <SelectItem key={protocol.key}>{protocol.label}</SelectItem>
              ))}
            </Select>
            <Button
              size='lg'
              className='h-15'
              variant='bordered'
              aria-label='Search button'
              startContent={<SearchIcon />}
              onPress={handleSearch}
            >
              Search
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Show Results with Delay */}
      {moved && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className='rounded lg:p-10 md:p-5 p-2 border-gray-50 w-full'
        >
          {showResults ? (
            <UserSearchResults
              userAddress={walletAddress}
              protocol={protocol}
            />
          ) : (
            <div className='flex items-center w-full justify-center'>
              <Spinner color='secondary' size='lg' />
            </div>
          )}
        </motion.div>
      )}
    </main>
  );
}
