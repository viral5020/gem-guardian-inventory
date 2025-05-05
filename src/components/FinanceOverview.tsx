
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
import { Wallet, ArrowDownCircle, ArrowUpCircle, CreditCard, Edit, Trash, Plus } from "lucide-react";
import { 
  Transaction, 
  cashBalance, 
  bankBalance, 
  recentTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction
} from "@/data/mockFinance";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const transactionSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date (YYYY-MM-DD)"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  amount: z.coerce.number().positive("Amount must be positive"),
  type: z.enum(["deposit", "withdrawal"]),
  account: z.enum(["cash", "bank"])
});

type TransactionFormData = z.infer<typeof transactionSchema>;

const FinanceOverview: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState<'all' | 'cash' | 'bank'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState(recentTransactions);
  const { toast } = useToast();
  
  const filteredTransactions = selectedAccount === 'all' 
    ? transactions 
    : transactions.filter(t => t.account === selectedAccount);

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      description: "",
      amount: 0,
      type: "deposit",
      account: "cash"
    }
  });

  const handleAddTransaction = () => {
    setCurrentTransaction(null);
    form.reset({
      date: new Date().toISOString().split('T')[0],
      description: "",
      amount: 0,
      type: "deposit",
      account: "cash"
    });
    setIsDialogOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setCurrentTransaction(transaction);
    form.reset({
      date: transaction.date,
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      account: transaction.account
    });
    setIsDialogOpen(true);
  };

  const handleDeleteTransaction = (id: string) => {
    if (deleteTransaction(id)) {
      setTransactions([...recentTransactions]);
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
    }
  };

  const onSubmit = (data: TransactionFormData) => {
    if (currentTransaction) {
      // Update
      const updated = updateTransaction(currentTransaction.id, data);
      if (updated) {
        setTransactions([...recentTransactions]);
        toast({
          title: "Success",
          description: "Transaction updated successfully",
        });
      }
    } else {
      // Add
      const added = addTransaction(data);
      setTransactions([...recentTransactions]);
      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
    }
    setIsDialogOpen(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center justify-between">
          <div className="flex items-center">
            <Wallet className="mr-2 h-5 w-5" />
            Finance Overview
          </div>
          <Button size="sm" onClick={handleAddTransaction}>
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
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
            <TransactionTable 
              transactions={filteredTransactions} 
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
            />
          </TabsContent>
          
          <TabsContent value="cash" className="mt-0">
            <TransactionTable 
              transactions={filteredTransactions}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
            />
          </TabsContent>
          
          <TabsContent value="bank" className="mt-0">
            <TransactionTable 
              transactions={filteredTransactions}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
            />
          </TabsContent>
        </Tabs>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {currentTransaction ? "Edit Transaction" : "Add Transaction"}
              </DialogTitle>
              <DialogDescription>
                {currentTransaction 
                  ? "Update the transaction details below." 
                  : "Fill in the transaction details below."}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            {...field}
                          >
                            <option value="deposit">Deposit</option>
                            <option value="withdrawal">Withdrawal</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="account"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            {...field}
                          >
                            <option value="cash">Cash</option>
                            <option value="bank">Bank</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="submit">
                    {currentTransaction ? "Update" : "Add"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

const TransactionTable: React.FC<{ 
  transactions: Transaction[],
  onEdit: (transaction: Transaction) => void,
  onDelete: (id: string) => void
}> = ({ transactions, onEdit, onDelete }) => {
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

export default FinanceOverview;
