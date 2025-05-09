
import React, { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Invoice, InvoiceItem, InvoiceSummary } from '@/types/invoice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { ArrowLeft, Plus, Trash2, Calculator } from 'lucide-react';
import { generateInvoiceNumber, calculateInvoiceSummary } from '@/data/mockInvoices';
import { mockLots } from '@/data/mockLots';

interface InvoiceFormProps {
  existingInvoice?: Invoice;
  onSubmit: (invoice: Invoice) => void;
  onCancel: () => void;
  customers: Array<{ id: string; name: string; address: string; email?: string; phone?: string }>;
}

const InvoiceForm = ({ existingInvoice, onSubmit, onCancel, customers }: InvoiceFormProps) => {
  const [taxRate, setTaxRate] = useState<number>(existingInvoice?.summary.salesTax && existingInvoice.summary.subtotal ? 
    existingInvoice.summary.salesTax / (existingInvoice.summary.subtotal - existingInvoice.summary.discount) : 0.08);
  
  const defaultValues: Partial<Invoice> = existingInvoice || {
    invoiceNumber: generateInvoiceNumber(),
    page: 1,
    totalPages: 1,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    terms: 'Net 15',
    items: [
      {
        id: 'item-1',
        description: '',
        quantity: 1,
        unit: 'C',
        unitPrice: 0,
        amount: 0,
      },
    ],
    summary: {
      subtotal: 0,
      discount: 0,
      salesTax: 0,
      vat: 0,
      shipping: 0,
      insurance: 0,
      other: 0,
      netAmount: 0,
    },
    status: 'DRAFT' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const form = useForm<Invoice>({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const watchItems = form.watch('items');
  const watchDiscount = form.watch('summary.discount') || 0;
  const watchShipping = form.watch('summary.shipping') || 0;
  const watchInsurance = form.watch('summary.insurance') || 0;
  const watchOther = form.watch('summary.other') || 0;

  // Calculate totals whenever items or other fields change
  React.useEffect(() => {
    if (watchItems) {
      // Calculate each item's amount based on quantity and unit price
      const updatedItems = watchItems.map(item => ({
        ...item,
        amount: Number(item.quantity || 0) * Number(item.unitPrice || 0)
      }));
      
      // Update each item's amount
      updatedItems.forEach((item, index) => {
        form.setValue(`items.${index}.amount`, item.amount);
      });

      // Calculate and update summary
      const summary = calculateInvoiceSummary(
        updatedItems, 
        Number(watchDiscount || 0),
        taxRate,
        Number(watchShipping || 0),
        Number(watchInsurance || 0),
        Number(watchOther || 0)
      );
      
      Object.entries(summary).forEach(([key, value]) => {
        form.setValue(`summary.${key as keyof InvoiceSummary}`, value);
      });
    }
  }, [watchItems, watchDiscount, taxRate, watchShipping, watchInsurance, watchOther, form]);

  const handleSelectCustomer = (customerId: string) => {
    const selectedCustomer = customers.find(c => c.id === customerId);
    if (selectedCustomer) {
      form.setValue('customerId', selectedCustomer.id);
      form.setValue('customerName', selectedCustomer.name);
      form.setValue('customerAddress', selectedCustomer.address);
      form.setValue('customerPhone', selectedCustomer.phone || '');
      form.setValue('customerEmail', selectedCustomer.email || '');
    }
  };

  const handleAddItem = () => {
    append({
      id: `item-${fields.length + 1}`,
      description: '',
      quantity: 1,
      unit: 'C',
      unitPrice: 0,
      amount: 0
    });
  };

  const handleFormSubmit = (data: Invoice) => {
    // In a real implementation, we'd add validation and potentially backend calls here
    onSubmit({
      ...data,
      id: existingInvoice?.id || `invoice-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onCancel}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">
            {existingInvoice ? `Edit Invoice ${existingInvoice.invoiceNumber}` : 'Create New Invoice'}
          </h1>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Invoice Details */}
            <Card>
              <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="invoiceNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="DRAFT">Draft</SelectItem>
                            <SelectItem value="SENT">Sent</SelectItem>
                            <SelectItem value="PAID">Paid</SelectItem>
                            <SelectItem value="OVERDUE">Overdue</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="invoiceDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Terms</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select terms" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Net 15">Net 15</SelectItem>
                            <SelectItem value="Net 30">Net 30</SelectItem>
                            <SelectItem value="Net 45">Net 45</SelectItem>
                            <SelectItem value="Net 60">Net 60</SelectItem>
                            <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="purchaseOrder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purchase Order #</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="vendorInvoice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vendor Invoice #</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vendorInvoiceDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vendor Invoice Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="shipVia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ship Via</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tracking"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tracking #</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Label>Select Customer</Label>
                  <Select onValueChange={handleSelectCustomer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customerAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="customerEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="customerPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Line Items */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Line Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Certificate/Lot #</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[80px]">Serial #</TableHead>
                    <TableHead className="w-[80px]">Unit</TableHead>
                    <TableHead className="w-[80px] text-right">Quantity</TableHead>
                    <TableHead className="w-[80px] text-right">Carat</TableHead>
                    <TableHead className="w-[100px] text-right">Unit Price</TableHead>
                    <TableHead className="w-[100px] text-right">Amount</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell>
                        <Controller
                          name={`items.${index}.lotId`}
                          control={form.control}
                          defaultValue={field.lotId}
                          render={({ field: lotField }) => (
                            <Select 
                              onValueChange={(value) => {
                                lotField.onChange(value);
                                const selectedLot = mockLots.find(lot => lot.id === value);
                                if (selectedLot) {
                                  form.setValue(`items.${index}.description`, `Diamonds from lot ${selectedLot.lotId}`);
                                  form.setValue(`items.${index}.unit`, 'C');
                                  form.setValue(`items.${index}.carat`, selectedLot.remainingCarats);
                                }
                              }}
                              value={lotField.value || ''}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Select lot" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockLots.map(lot => (
                                  <SelectItem key={lot.id} value={lot.id}>
                                    {lot.lotId}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          {...form.register(`items.${index}.description`)}
                          className="h-9"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          {...form.register(`items.${index}.serialNumber`)}
                          className="h-9"
                        />
                      </TableCell>
                      <TableCell>
                        <Controller
                          name={`items.${index}.unit`}
                          control={form.control}
                          defaultValue={field.unit}
                          render={({ field: unitField }) => (
                            <Select 
                              onValueChange={unitField.onChange} 
                              value={unitField.value}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="C">C</SelectItem>
                                <SelectItem value="PC">PC</SelectItem>
                                <SelectItem value="LOT">LOT</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          step="1"
                          {...form.register(`items.${index}.quantity`, { 
                            valueAsNumber: true,
                            min: 1
                          })}
                          className="h-9 text-right"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="0.0001"
                          {...form.register(`items.${index}.carat`, { 
                            valueAsNumber: true,
                            min: 0
                          })}
                          className="h-9 text-right"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          {...form.register(`items.${index}.unitPrice`, { 
                            valueAsNumber: true,
                            min: 0
                          })}
                          className="h-9 text-right"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(watchItems[index]?.amount || 0)}
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => fields.length > 1 && remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <Button 
                type="button" 
                variant="outline" 
                className="mt-4"
                onClick={handleAddItem}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Line Item
              </Button>
            </CardContent>
          </Card>

          {/* Invoice Summary */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Invoice Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea rows={4} {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between font-medium">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(form.watch('summary.subtotal') || 0)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name="summary.discount"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 flex-1">
                          <FormLabel className="min-w-20">Discount:</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              min="0"
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              value={field.value || 0}
                              className="h-8"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <span className="pl-4">{formatCurrency(form.watch('summary.discount') || 0)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <Label className="min-w-20">Sales Tax Rate:</Label>
                      <Input 
                        type="number"
                        min="0"
                        max="1"
                        step="0.001"
                        value={taxRate}
                        onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                        className="h-8"
                      />
                      <span>({(taxRate * 100).toFixed(1)}%)</span>
                    </div>
                    <span className="pl-4">{formatCurrency(form.watch('summary.salesTax') || 0)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name="summary.shipping"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 flex-1">
                          <FormLabel className="min-w-20">Shipping:</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              min="0"
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              value={field.value || 0}
                              className="h-8"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <span className="pl-4">{formatCurrency(form.watch('summary.shipping') || 0)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name="summary.insurance"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 flex-1">
                          <FormLabel className="min-w-20">Insurance:</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              min="0"
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              value={field.value || 0}
                              className="h-8"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <span className="pl-4">{formatCurrency(form.watch('summary.insurance') || 0)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <FormField
                      control={form.control}
                      name="summary.other"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 flex-1">
                          <FormLabel className="min-w-20">Other:</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              min="0"
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              value={field.value || 0}
                              className="h-8"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <span className="pl-4">{formatCurrency(form.watch('summary.other') || 0)}</span>
                  </div>

                  <div className="pt-2 border-t flex justify-between font-bold">
                    <span>Net Amount:</span>
                    <span>{formatCurrency(form.watch('summary.netAmount') || 0)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <div className="space-x-2">
                <Button type="button" variant="outline">
                  Save as Draft
                </Button>
                <Button type="submit">
                  {existingInvoice ? 'Update Invoice' : 'Create Invoice'}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default InvoiceForm;
