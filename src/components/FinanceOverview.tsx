
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Wallet, ArrowDownCircle, ArrowUpCircle, CreditCard } from "lucide-react";
import { Transaction, cashBalance, bankBalance, recentTransactions } from "@/data/mockFinance";
import { formatCurrency, formatDate } from "@/lib/utils";

const FinanceOverview: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState<'all' | 'cash' | 'bank'>('all');
  
  const filteredTransactions = selectedAccount === 'all' 
    ? recentTransactions 
    : recentTransactions.filter(t => t.account === selectedAccount);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center">
          <Wallet className="mr-2 h-5 w-5" />
          Finance Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <CreditCard className="h-8 w-8 text-primary mr-2" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Cash Balance</p>
                    <p className="text-2xl font-bold">{formatCurrency(cashBalance)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Wallet className="h-8 w-8 text-primary mr-2" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Bank Balance</p>
                    <p className="text-2xl font-bold">{formatCurrency(bankBalance)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
        
        <Tabs defaultValue="all" onValueChange={(v) => setSelectedAccount(v as any)}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="cash">Cash</TabsTrigger>
            <TabsTrigger value="bank">Bank</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <TransactionTable transactions={filteredTransactions} />
          </TabsContent>
          
          <TabsContent value="cash" className="mt-0">
            <TransactionTable transactions={filteredTransactions} />
          </TabsContent>
          
          <TabsContent value="bank" className="mt-0">
            <TransactionTable transactions={filteredTransactions} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const TransactionTable: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FinanceOverview;
