
import React from "react";
import { LotTransaction } from "@/types/lot";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowUp, ArrowDown, Package, User } from "lucide-react";

interface LotTransactionHistoryProps {
  transactions: LotTransaction[];
}

const LotTransactionHistory = ({ transactions }: LotTransactionHistoryProps) => {
  if (transactions.length === 0) {
    return (
      <p className="text-muted-foreground text-sm py-4">No transactions recorded for this lot yet.</p>
    );
  }

  // Sort transactions by date, newest first
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Carats</TableHead>
          <TableHead>Handler</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedTransactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell className="whitespace-nowrap">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                {formatDate(transaction.date)}
              </div>
            </TableCell>
            <TableCell>
              {transaction.type === 'SALE' ? (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" />
                  Sale
                </Badge>
              ) : transaction.type === 'RETURN' ? (
                <Badge variant="default" className="flex items-center gap-1">
                  <ArrowDown className="h-3 w-3" />
                  Return
                </Badge>
              ) : (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  Transfer
                </Badge>
              )}
            </TableCell>
            <TableCell>{transaction.carats} ct</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                {transaction.handler}
              </div>
            </TableCell>
            <TableCell>{transaction.customer || '-'}</TableCell>
            <TableCell>
              {transaction.price ? formatCurrency(transaction.price) : '-'}
            </TableCell>
            <TableCell className="max-w-[200px] truncate">
              {transaction.notes || '-'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LotTransactionHistory;
