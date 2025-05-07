
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DiamondLot } from '@/types/lot';
import { generateLotId } from '@/data/mockLots';
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
import { ArrowLeft, Package } from 'lucide-react';

interface AddLotFormProps {
  onCancel: () => void;
  onSuccess: (lot: DiamondLot) => void;
}

const formSchema = z.object({
  totalCarats: z.coerce.number()
    .positive("Total carats must be positive")
    .min(0.01, "Minimum carat weight is 0.01"),
  dateReceived: z.string().min(1, "Date is required"),
  source: z.string().min(1, "Source/vendor is required"),
  initialValue: z.coerce.number()
    .min(0, "Initial value must be non-negative"),
  handler: z.string().min(1, "Handler is required"),
  notes: z.string().optional(),
});

const AddLotForm = ({ onCancel, onSuccess }: AddLotFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalCarats: 0,
      dateReceived: new Date().toISOString().split('T')[0],
      source: '',
      initialValue: 0,
      handler: '',
      notes: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newLot: DiamondLot = {
      id: `${Math.floor(Math.random() * 100000)}`,
      lotId: generateLotId(),
      totalCarats: values.totalCarats,
      dateReceived: values.dateReceived,
      source: values.source,
      initialValue: values.initialValue,
      remainingCarats: values.totalCarats,
      handler: values.handler,
      notes: values.notes,
      lastModified: new Date().toISOString(),
      transactions: []
    };
    
    onSuccess(newLot);
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
            <CardTitle className="text-2xl">Add New Diamond Lot</CardTitle>
            <CardDescription>Create a new lot to track diamonds</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="totalCarats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Carats</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormDescription>
                      Total weight of the diamond lot in carats
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dateReceived"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Received</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source/Vendor</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      The source or vendor of the diamonds
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="initialValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Value ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormDescription>
                      Estimated or purchased value of the lot
                    </FormDescription>
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
                      Staff member responsible for this lot
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormDescription>
                      Additional information about this lot
                    </FormDescription>
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
                <Package className="mr-2 h-4 w-4" />
                Create Lot
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddLotForm;
