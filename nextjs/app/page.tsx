'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import UserSearchResults from '@/components/SearchResults';
import { Spinner } from '@heroui/spinner';
import { Select, SelectItem } from '@heroui/select';
import { Button, ButtonGroup } from '@heroui/button';
import { Input } from '@heroui/input';
import SearchIcon from '@/components/SearchIcon';

export default function Home() {
  const [moved, setMoved] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [protocol, setProtocol] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchProtocol, setSearchProtocol] = useState('');

  const [showResults, setShowResults] = useState(false); // Delay showing results

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchProtocol(e.target.value);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (searchQuery !== '' && searchProtocol !== '') {
        setWalletAddress(searchQuery);
        setProtocol(Array.from(searchProtocol)[0]);
        setMoved(true);
        // Delay results by 500ms
        setTimeout(() => {
          setShowResults(true);
        }, 500);
      }
    }
  };

  const protocols = [
    { key: 'aave', label: 'Aave' },
    { key: 'compound', label: 'Compound' },
  ];

  useEffect(() => {
    console.log('protocol:', searchProtocol);
    console.log('query: ', searchQuery);
  }, [searchProtocol, searchQuery]);

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
        {/* <CustomSearchbar onSearch={onSearch} /> */}
        <div className='flex w-full flex-col flex-wrap md:flex-nowrap gap-4'>
          <Input
            isClearable
            label='Wallet Address'
            type='text'
            variant='bordered'
            onInput={(e) => setSearchQuery(e.currentTarget.value)}
            onKeyDown={handleSearch}
          />
          <div className='justify-between flex gap-4'>
            <Select
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
            >
              Search
            </Button>
          </div>
        </div>
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
            <UserSearchResults
              userAddress={walletAddress}
              protocol={protocol}
            />
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
