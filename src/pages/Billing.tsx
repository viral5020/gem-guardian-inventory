
import React, { useState } from 'react';
import { Invoice } from '@/types/invoice';
import { mockInvoices } from '@/data/mockInvoices';
import Navbar from '@/components/Navbar';
import InvoiceList from '@/components/InvoiceList';
import InvoiceDetail from '@/components/InvoiceDetail';
import InvoiceForm from '@/components/InvoiceForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { FileText, ArrowLeft } from 'lucide-react';

// Mock customer data for the form
const mockCustomers = [
  {
    id: 'cust-1',
    name: 'Tiffany & Co.',
    address: '727 Fifth Avenue, New York, NY 10022',
    phone: '+1 212-755-8000',
    email: 'orders@tiffany.com'
  },
  {
    id: 'cust-2',
    name: 'Cartier',
    address: '653 Fifth Avenue, New York, NY 10022',
    phone: '+1 212-446-3400',
    email: 'orders@cartier.com'
  },
  {
    id: 'cust-3',
    name: 'Blue Nile',
    address: '411 First Avenue, Seattle, WA 98109',
    phone: '+1 206-336-6700',
    email: 'orders@bluenile.com'
  }
];

enum BillingView {
  LIST,
  DETAIL,
  CREATE,
  EDIT
}

const Billing = () => {
  const [view, setView] = useState<BillingView>(BillingView.LIST);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Invoice['status']>('DRAFT');
  const { toast } = useToast();

  const goToList = () => {
    setView(BillingView.LIST);
    setSelectedInvoiceId(null);
  };

  const handleSelectInvoice = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setView(BillingView.DETAIL);
  };

  const handleCreateInvoice = () => {
    setView(BillingView.CREATE);
  };

  const handleEditInvoice = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setView(BillingView.EDIT);
  };

  const handleSaveInvoice = (invoice: Invoice) => {
    if (view === BillingView.EDIT) {
      // Update existing invoice
      setInvoices(invoices.map(inv => inv.id === invoice.id ? invoice : inv));
      toast({
        title: "Invoice Updated",
        description: `Invoice ${invoice.invoiceNumber} has been updated successfully.`
      });
    } else {
      // Add new invoice
      setInvoices([...invoices, invoice]);
      toast({
        title: "Invoice Created",
        description: `Invoice ${invoice.invoiceNumber} has been created successfully.`
      });
    }
    goToList();
  };

  const handleUpdateStatus = () => {
    if (selectedInvoiceId) {
      setInvoices(invoices.map(invoice => 
        invoice.id === selectedInvoiceId 
          ? { ...invoice, status: selectedStatus, updatedAt: new Date().toISOString() }
          : invoice
      ));
      
      // If marking as paid, add the paidAt date
      if (selectedStatus === 'PAID') {
        setInvoices(invoices.map(invoice => 
          invoice.id === selectedInvoiceId 
            ? { ...invoice, paidAt: new Date().toISOString() }
            : invoice
        ));
      }
      
      toast({
        title: "Status Updated",
        description: `Invoice status has been updated to ${selectedStatus}.`
      });
      setStatusDialogOpen(false);
    }
  };

  const selectedInvoice = selectedInvoiceId 
    ? invoices.find(invoice => invoice.id === selectedInvoiceId) 
    : null;

  const handleOpenStatusDialog = () => {
    if (selectedInvoice) {
      setSelectedStatus(selectedInvoice.status);
      setStatusDialogOpen(true);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <Button variant="ghost" onClick={() => window.location.href = "/"}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold flex items-center">
            <FileText className="mr-2 h-6 w-6" />
            Billing & Invoices
          </h1>
        </div>

        {view === BillingView.LIST && (
          <InvoiceList 
            invoices={invoices} 
            onSelectInvoice={handleSelectInvoice}
            onCreateInvoice={handleCreateInvoice}
          />
        )}

        {view === BillingView.DETAIL && selectedInvoice && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleOpenStatusDialog} variant="outline">
                    Update Status
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Update Invoice Status</DialogTitle>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="status" className="text-sm font-medium">
                        Status
                      </label>
                      <Select
                        value={selectedStatus}
                        onValueChange={(value) => setSelectedStatus(value as Invoice['status'])}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DRAFT">Draft</SelectItem>
                          <SelectItem value="SENT">Sent</SelectItem>
                          <SelectItem value="PAID">Paid</SelectItem>
                          <SelectItem value="OVERDUE">Overdue</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleUpdateStatus}>
                        Update Status
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button onClick={() => handleEditInvoice(selectedInvoice.id)} className="ml-2">
                Edit Invoice
              </Button>
            </div>
            <InvoiceDetail 
              invoice={selectedInvoice} 
              onBack={goToList} 
            />
          </div>
        )}

        {(view === BillingView.CREATE || view === BillingView.EDIT) && (
          <InvoiceForm
            existingInvoice={view === BillingView.EDIT ? selectedInvoice || undefined : undefined}
            onSubmit={handleSaveInvoice}
            onCancel={goToList}
            customers={mockCustomers}
          />
        )}
      </main>
    </div>
  );
};

export default Billing;
