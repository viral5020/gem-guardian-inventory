
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DiamondLot, LotTransaction } from '@/types/lot';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

interface AddLotTransactionFormProps {
  lot: DiamondLot;
  onCancel: () => void;
  onSuccess: (transaction: LotTransaction) => void;
}

const formSchema = z.object({
  type: z.enum(['SALE', 'RETURN', 'TRANSFER']),
  carats: z.coerce.number()
    .positive("Carats must be positive")
    .min(0.01, "Minimum carat weight is 0.01"),
  date: z.string().min(1, "Date is required"),
  handler: z.string().min(1, "Handler is required"),
  customer: z.string().optional(),
  price: z.coerce.number().optional(),
  reason: z.string().optional(),
  notes: z.string().optional(),
})
.refine((data) => {
  // Validate that sales and returns have a customer
  if (data.type === 'SALE' || data.type === 'RETURN') {
    return !!data.customer;
  }
  return true;
}, {
  message: "Customer is required for sales and returns",
  path: ["customer"],
})
.refine((data) => {
  // Validate that sales have a price
  if (data.type === 'SALE') {
    return data.price !== undefined && data.price > 0;
  }
  return true;
}, {
  message: "Price is required for sales",
  path: ["price"],
})
.refine((data) => {
  // Validate that returns have a reason
  if (data.type === 'RETURN') {
    return !!data.reason;
  }
  return true;
}, {
  message: "Reason is required for returns",
  path: ["reason"],
});

const AddLotTransactionForm = ({ lot, onCancel, onSuccess }: AddLotTransactionFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'SALE',
      carats: 0,
      date: new Date().toISOString().split('T')[0],
      handler: lot.handler,
      customer: '',
      price: undefined,
      reason: '',
      notes: '',
    },
  });
  
  const watchTransactionType = form.watch('type');

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Validate that sale carats don't exceed remaining carats
    if (values.type === 'SALE' && values.carats > lot.remainingCarats) {
      form.setError('carats', { 
        type: 'manual',
        message: `Cannot sell more than the remaining ${lot.remainingCarats} carats` 
      });
      return;
    }
    
    const newTransaction: LotTransaction = {
      id: `t${Math.floor(Math.random() * 100000)}`,
      lotId: lot.id,
      date: values.date,
      type: values.type,
      carats: values.carats,
      handler: values.handler,
      customer: values.customer,
      price: values.price,
      reason: values.reason,
      notes: values.notes
    };
    
    onSuccess(newTransaction);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onCancel} type="button">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <div>
            <CardTitle className="text-2xl">Add Transaction</CardTitle>
            <CardDescription>Record a new transaction for Lot {lot.lotId}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SALE">Sale</SelectItem>
                        <SelectItem value="RETURN">Return</SelectItem>
                        <SelectItem value="TRANSFER">Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="carats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carats</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    {watchTransactionType === 'SALE' && (
                      <FormDescription>
                        Available: {lot.remainingCarats} carats
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                name="handler"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Handler</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Staff member responsible for this transaction
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {(watchTransactionType === 'SALE' || watchTransactionType === 'RETURN') && (
                <FormField
                  control={form.control}
                  name="customer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {watchTransactionType === 'SALE' && (
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sale Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {watchTransactionType === 'RETURN' && (
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Return Reason</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                Save Transaction
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddLotTransactionForm;
