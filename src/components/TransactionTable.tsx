
import React from "react";
import { Transaction } from "@/data/mockFinance";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ArrowDownCircle, ArrowUpCircle, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ 
  transactions, 
  onEdit, 
  onDelete 
}) => {
  if (transactions.length === 0) {
    return <p className="text-muted-foreground text-sm">No transactions found.</p>;
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Account</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{formatDate(transaction.date)}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell className="capitalize">{transaction.account}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end">
                  {transaction.type === "deposit" ? (
                    <ArrowUpCircle className="mr-2 h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownCircle className="mr-2 h-4 w-4 text-red-500" />
                  )}
                  <span className={transaction.type === "deposit" ? "text-green-600" : "text-red-600"}>
                    {transaction.type === "deposit" ? "+" : "-"}{formatCurrency(transaction.amount)}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onEdit(transaction)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onDelete(transaction.id)}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;
