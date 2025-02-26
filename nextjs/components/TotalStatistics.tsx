import { AaveUser, CompoundUser, SiloUser } from '@/common/types';
import { isAaveUser } from '@/common/utils';
import { ethers } from 'ethers';

interface StatisticsProps {
  user: AaveUser | CompoundUser | SiloUser;
}

export default function TotalStatistics({ user }: StatisticsProps) {
  return (
    <div>
      <h2 className='text-xl lg:my-4 my-2 flex lg:flex-row flex-col'>
        <span className='font-semibold brightness-75 uppercase tracking-widest'>
          Address:
        </span>
        <span className='font-bold truncate'>{user.id}</span>
      </h2>
      <div className='grid lg:grid-cols-3 lg:grid-rows-2 grid-cols-2 grid-rows-3 lg:gap-4 gap-2'>
        <div className='flex flex-col'>
          <span className='font-semibold brightness-75 uppercase text-sm tracking-widest'>
            Total Supplied:
          </span>
          <span className='text-xl font-bold overflow-hidden text-ellipsis'>
            {ethers.formatEther(BigInt(user.totalSupplied))}
          </span>
        </div>
        <div className='flex flex-col'>
          <span className='font-semibold brightness-75 uppercase text-sm tracking-widest'>
            Total Borrowed:
          </span>
          <span className='text-xl font-bold overflow-hidden text-ellipsis'>
            {ethers.formatEther(BigInt(user.totalBorrowed))}
          </span>
        </div>
        <div className='flex flex-col'>
          <span className='font-semibold brightness-75 uppercase text-sm tracking-widest'>
            Total Repaid:
          </span>
          <span className='text-xl font-bold overflow-hidden text-ellipsis'>
            {ethers.formatEther(BigInt(user.totalRepaid))}
          </span>
        </div>
        <div className='flex flex-col'>
          <span className='font-semibold brightness-75 uppercase text-sm tracking-widest'>
            Total Liquidated:
          </span>
          <span className='text-xl font-bold overflow-hidden text-ellipsis'>
            {ethers.formatEther(BigInt(user.totalLiquidated))}
          </span>
        </div>
        <div className='flex flex-col'>
          <span className='font-semibold brightness-75 uppercase text-sm tracking-widest'>
            Total Withdrawn:
          </span>
          <span className='text-xl font-bold overflow-hidden text-ellipsis'>
            {ethers.formatEther(BigInt(user.totalWithdrawn))}
          </span>
        </div>
        {isAaveUser(user) && (
          <div className='flex flex-col'>
            <span className='font-semibold brightness-75 uppercase text-sm tracking-widest'>
              Reserve as Collateral:
            </span>
            <span className='text-xl font-bold overflow-hidden text-ellipsis'>
              {user.useReserveAsCollateral}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
