import { UserTransaction } from '@/utils/getRequestData';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue,
} from '@heroui/table';
import { Pagination } from '@heroui/pagination';
import { Spinner } from '@heroui/spinner';
import { Dispatch, SetStateAction } from 'react';

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

// export default function TransactionTable({
//   transactions,
// }: TransactioTableProps) {
//   return (
//     <div>
//       <h2 className='mt-8 font-semibold underline text-xl'>All Transactions</h2>
//       <div className='w-full my-3 overflow-x-auto bg-lightgrey2 border border-lightgrey3 rounded-2xl'>
//         <div className='min-w-max'>
//           <Table aria-label='User Transaction Table' className='min-w-full'>
//             <TableHeader columns={columns}>
//               {(column) => (
//                 <TableColumn
//                   className='underline underline-offset-2 py-2 text-left font-bold'
//                   key={column.key}
//                 >
//                   {column.label}
//                 </TableColumn>
//               )}
//             </TableHeader>
//             <TableBody items={transactions}>
//               {(item) => (
//                 <TableRow key={item.id}>
//                   {(columnKey) => (
//                     <TableCell className='pr-2 whitespace-nowrap font-semibold'>
//                       {getKeyValue(item, columnKey)}
//                     </TableCell>
//                   )}
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>
//       </div>
//     </div>
//   );
// }

export default function TransactionTable({
  transactions,
  isLoading,
  page,
  totalPages,
  setPage,
}: TransactionTableProps) {
  return (
    <div>
      <h2 className='mt-8 font-semibold underline text-xl'>All Transactions</h2>
      <div className='w-full my-3 overflow-x-auto bg-lightgrey2 border border-lightgrey3 rounded-2xl'>
        <div className='min-w-max'>
          <Table
            aria-label='User Transactions'
            bottomContent={
              totalPages > 1 ? (
                <div className='flex w-full justify-center'>
                  <Pagination
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
            <TableHeader>
              <TableColumn key='id'>ID</TableColumn>
              <TableColumn key='eventType'>Type</TableColumn>
              <TableColumn key='amount'>Amount</TableColumn>
              <TableColumn key='reserve'>Reserve</TableColumn>
              <TableColumn key='transactionHash'>Hash</TableColumn>
              <TableColumn key='timestamp'>Timestamp</TableColumn>
            </TableHeader>
            <TableBody
              items={transactions ?? []}
              loadingContent={<Spinner />}
              loadingState={isLoading ? 'loading' : 'idle'}
            >
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>{getKeyValue(item, columnKey)}</TableCell>
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
