import { ethers } from 'ethers';

export const convertTimestamp = (timestamp: string): string => {
  return new Date(Number(timestamp) / 1_000).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};

export const convertEther = (amount: string) => {
  return ethers.formatEther(BigInt(amount));
};
