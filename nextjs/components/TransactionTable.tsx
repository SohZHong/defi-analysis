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
    <div className="overflow-x-auto w-full my-3">
      <Table aria-label="User Transaction Table" className="p-0 min-w-full">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn className="text-left font-bold underline underline-offset-1" key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={transactions}>
          {(item) => (
            <TableRow key={item.eventType.concat(item.transactionHash)}>
              {(columnKey) => (
                <TableCell className="pr-2 whitespace-nowrap">
                  {getKeyValue(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
