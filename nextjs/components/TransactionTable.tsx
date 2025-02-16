import { UserTransaction } from '@/utils/getRequestData';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from '@heroui/table';
import { Pagination } from '@heroui/pagination';
import { Spinner } from '@heroui/spinner';
import { Dispatch, SetStateAction } from 'react';
import React from 'react';
import { convertEther, convertTimestamp } from '@/utils/parseUtils';

const columns = [
  {
    key: 'id',
    label: 'ID',
  },
  {
    key: 'eventType',
    label: 'TYPE',
  },
  {
    key: 'amount',
    label: 'AMOUNT',
  },
  {
    key: 'reserve',
    label: 'RESERVE',
  },
  {
    key: 'transactionHash',
    label: 'HASH',
  },
  {
    key: 'timestamp',
    label: 'TIMESTAMP',
  },
];

interface TransactionTableProps {
  transactions: UserTransaction[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  setPage: Dispatch<SetStateAction<number>>;
}

export default function TransactionTable({
  transactions,
  isLoading,
  page,
  totalPages,
  setPage,
}: TransactionTableProps) {
  // Add formatting to individual cells
  const renderCell = React.useCallback(
    (transaction: UserTransaction, columnKey: React.Key) => {
      const cellValue = transaction[columnKey as keyof UserTransaction];

      switch (columnKey) {
        case 'amount':
          return convertEther(cellValue);
        case 'timestamp':
          return convertTimestamp(cellValue);
        default:
          return cellValue;
      }
    },
    []
  );

  return (
    <div>
      <h2 className='mt-8 font-semibold underline text-xl'>All Transactions</h2>
      <div className='w-full my-3 overflow-x-auto bg-lightgrey2 border border-lightgrey3 rounded-2xl'>
        <div className='min-w-max'>
          <Table
            aria-label='User Transactions'
            bottomContent={
              totalPages > 0 ? (
                <div className='flex w-full justify-center'>
                  <Pagination
                    isCompact
                    showControls
                    color='secondary'
                    page={page}
                    total={totalPages}
                    onChange={(newPage: number) => setPage(newPage)}
                  />
                </div>
              ) : null
            }
          >
            <TableHeader className='' columns={columns}>
              {(column) => (
                <TableColumn className=' text-left' key={column.key}>
                  {column.label}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={transactions}
              loadingContent={<Spinner color='secondary' />}
              loadingState={isLoading ? 'loading' : 'idle'}
            >
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>
                      {/* <div className='w-full overflow-x-auto'> */}
                      <div className=' font-semibold'>
                        {renderCell(item, columnKey)}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
