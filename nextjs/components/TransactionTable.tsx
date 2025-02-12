import { UserTransaction } from "@/utils/getRequestData";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/table";

const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "eventType",
    label: "TYPE",
  },
  {
    key: "amount",
    label: "AMOUNT",
  },
  {
    key: "reserve",
    label: "RESERVE",
  },
  {
    key: "transactionHash",
    label: "HASH",
  },
  {
    key: "timestamp",
    label: "TIMESTAMP",
  },
];

interface TransactioTableProps {
  transactions: UserTransaction[];
}

export default function TransactionTable({
  transactions,
}: TransactioTableProps) {
  return (
    <div>
      <h2 className="mt-8 font-semibold underline text-xl">All Transactions</h2>
      <div className="w-full my-3 overflow-x-auto bg-lightgrey2 border border-lightgrey3 rounded-2xl">
        <div className="min-w-max">
          <Table aria-label="User Transaction Table" className="min-w-full">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  className="underline underline-offset-2 py-2 text-left font-bold"
                  key={column.key}
                >
                  {column.label}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={transactions}>
              {(item) => (
                <TableRow key={item.eventType.concat(item.transactionHash)}>
                  {(columnKey) => (
                    <TableCell className="pr-2 whitespace-nowrap font-semibold">
                      {getKeyValue(item, columnKey)}
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
