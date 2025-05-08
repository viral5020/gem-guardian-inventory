
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DiamondLot, LotTransaction } from '@/types/lot';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Package } from 'lucide-react';

interface AddLotTransactionFormProps {
  lot: DiamondLot;
  onCancel: () => void;
  onSuccess: (transaction: LotTransaction) => void;
}

const formSchema = z.object({
  type: z.enum(['SALE', 'RETURN', 'TRANSFER']),
  carats: z.coerce.number()
    .positive("Carats must be positive")
    .refine((value) => value > 0, { message: "Carat value must be greater than 0" }),
  handler: z.string().min(1, "Handler is required"),
  customer: z.string().optional(),
  price: z.coerce.number().optional(),
  notes: z.string().optional(),
});

const AddLotTransactionForm = ({ lot, onCancel, onSuccess }: AddLotTransactionFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'SALE',
      carats: 0,
      handler: '',
      customer: '',
      price: undefined,
      notes: '',
    },
  });
  
  const watchType = form.watch('type');

  const onSubmit = (values: z.infer<typeof formSchema>) => {
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
      type: values.type,
      date: new Date().toISOString().split('T')[0],
      carats: values.carats,
      handler: values.handler,
      customer: values.customer,
      price: values.price,
      notes: values.notes,
    };
    
    onSuccess(newTransaction);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add Transaction for Lot {lot.lotId}</CardTitle>
        <CardDescription>
          Record a new sale, return, or transfer for this diamond lot
        </CardDescription>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select transaction type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SALE">
                          <div className="flex items-center">
                            <ArrowUp className="mr-2 h-4 w-4 text-destructive" />
                            Sale
                          </div>
                        </SelectItem>
                        <SelectItem value="RETURN">
                          <div className="flex items-center">
                            <ArrowDown className="mr-2 h-4 w-4 text-primary" />
                            Return
                          </div>
                        </SelectItem>
                        <SelectItem value="TRANSFER">
                          <div className="flex items-center">
                            <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                            Transfer
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {watchType === 'SALE' ? 'Record diamonds sold from this lot' :
                       watchType === 'RETURN' ? 'Record diamonds returned to this lot' :
                       'Record diamonds transferred to another location'}
                    </FormDescription>
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
                    {watchType === 'SALE' && (
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
                name="handler"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Handled By</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Staff member handling this transaction
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {watchType === 'SALE' || watchType === 'RETURN' ? (
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
              ) : null}
              
              {watchType === 'SALE' && (
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
              
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {watchType === 'SALE' ? 'Record Sale' : 
                 watchType === 'RETURN' ? 'Record Return' : 'Record Transfer'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddLotTransactionForm;
