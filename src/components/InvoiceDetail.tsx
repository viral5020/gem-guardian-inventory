
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Invoice } from '@/types/invoice';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Printer, Send, FileText, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface InvoiceDetailProps {
  invoice: Invoice;
  onBack: () => void;
}

const InvoiceDetail = ({ invoice, onBack }: InvoiceDetailProps) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: `Invoice-${invoice.invoiceNumber}`,
  });

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'SENT':
        return 'bg-blue-100 text-blue-800';
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadInvoice = () => {
    // In a real app, this would generate a PDF download
    alert('In a production app, this would download the invoice as a PDF');
  };

  const emailInvoice = () => {
    // In a real app, this would send the invoice via email
    alert(`In a production app, this would email the invoice to ${invoice.customerEmail}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">
            Invoice {invoice.invoiceNumber}
          </h1>
          <Badge className={getStatusColor(invoice.status)}>
            {invoice.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-1 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" onClick={downloadInvoice}>
            <Download className="mr-1 h-4 w-4" />
            Download
          </Button>
          <Button variant="default" onClick={emailInvoice}>
            <Send className="mr-1 h-4 w-4" />
            Email Invoice
          </Button>
        </div>
      </div>

      {/* Printable Invoice */}
      <Card>
        <CardContent className="p-6">
          <div ref={invoiceRef} className="p-6 max-w-4xl mx-auto">
            {/* Invoice Header */}
            <div className="flex justify-between items-start border-b border-gray-200 pb-4">
              <div className="flex items-center">
                <div className="mr-4">
                  <img 
                    src="/lovable-uploads/bf784e94-6fd7-4804-af54-88802303fedf.png" 
                    alt="Company Logo" 
                    className="h-16 w-auto" 
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-blue-700">Sparkle Inc</h1>
                  <p className="text-sm">200 Metroplex Drive, Suite 401, Edison, NJ 08817</p>
                  <p className="text-sm">Tel: +1 732-248-8333 Ext. 8740</p>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-gray-200 px-4 py-1 mb-2">
                  <h2 className="text-xl font-bold">INVOICE</h2>
                </div>
                <table className="text-sm">
                  <tbody>
                    <tr>
                      <td className="pr-3">Page</td>
                      <td>{invoice.page} of {invoice.totalPages}</td>
                    </tr>
                    <tr>
                      <td className="pr-3">Invoice #</td>
                      <td>{invoice.invoiceNumber}</td>
                    </tr>
                    <tr>
                      <td className="pr-3">Invoice Date</td>
                      <td>{formatDate(invoice.invoiceDate)}</td>
                    </tr>
                    <tr>
                      <td className="pr-3">Due Date</td>
                      <td>{formatDate(invoice.dueDate)}</td>
                    </tr>
                    <tr>
                      <td className="pr-3">Terms</td>
                      <td>{invoice.terms}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bill To */}
            <div className="mt-6 mb-8">
              <div className="bg-gray-200 px-3 py-1">
                <h3 className="text-sm font-bold">Bill To/Ship To</h3>
              </div>
              <div className="p-3 border border-gray-200">
                <p className="font-bold">{invoice.customerName}</p>
                <p className="whitespace-pre-line">{invoice.customerAddress}</p>
                {invoice.customerPhone && <p>Phone: {invoice.customerPhone}</p>}
                {invoice.customerEmail && <p>Email: {invoice.customerEmail}</p>}
              </div>
            </div>

            {/* Invoice Reference Data */}
            <div className="grid grid-cols-3 gap-1 mb-6 text-sm border border-gray-200">
              <div className="border-r border-b border-gray-200 p-2">
                <span className="font-bold">Vendor Invoice #:</span> {invoice.vendorInvoice || '-'}
              </div>
              <div className="border-r border-b border-gray-200 p-2">
                <span className="font-bold">Vendor Invoice Date:</span> {invoice.vendorInvoiceDate ? formatDate(invoice.vendorInvoiceDate) : '-'}
              </div>
              <div className="border-b border-gray-200 p-2">
                <span className="font-bold">Ship Via:</span> {invoice.shipVia || '-'}
              </div>
              <div className="border-r border-gray-200 p-2">
                <span className="font-bold">Tracking #:</span> {invoice.tracking || '-'}
              </div>
              <div className="border-r border-gray-200 p-2 col-span-2">
                <span className="font-bold">Purchase Order #:</span> {invoice.purchaseOrder || '-'}
              </div>
            </div>

            {/* Invoice Line Items */}
            <div className="mb-6">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="w-14">#</TableHead>
                    <TableHead className="w-24">Lot # / Certificate #</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-14">Ser #</TableHead>
                    <TableHead className="w-14">Unit</TableHead>
                    <TableHead className="w-14 text-right">Price</TableHead>
                    <TableHead className="w-14 text-right">Carat</TableHead>
                    <TableHead className="w-20 text-right">Price</TableHead>
                    <TableHead className="w-24 text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.certificateId || item.lotId || '-'}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.serialNumber || '-'}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{item.carat?.toFixed(4) || '-'}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Totals */}
            <div className="flex justify-between">
              <div className="border border-gray-200 p-2 w-48">
                <p><span className="font-bold">Total Qty: </span>{invoice.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
              </div>
              <div className="w-72">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border border-gray-200">
                      <td className="p-2 font-bold">Grand Total</td>
                      <td className="p-2 text-right">{formatCurrency(invoice.summary.subtotal)}</td>
                    </tr>
                    <tr className="border-l border-r border-gray-200">
                      <td className="p-2">Discount</td>
                      <td className="p-2 text-right">{formatCurrency(invoice.summary.discount)}</td>
                    </tr>
                    <tr className="border-l border-r border-gray-200">
                      <td className="p-2">Sales Tax</td>
                      <td className="p-2 text-right">{formatCurrency(invoice.summary.salesTax)}</td>
                    </tr>
                    <tr className="border-l border-r border-gray-200">
                      <td className="p-2">VAT</td>
                      <td className="p-2 text-right">{formatCurrency(invoice.summary.vat)}</td>
                    </tr>
                    <tr className="border-l border-r border-gray-200">
                      <td className="p-2">Shipping</td>
                      <td className="p-2 text-right">{formatCurrency(invoice.summary.shipping)}</td>
                    </tr>
                    <tr className="border-l border-r border-gray-200">
                      <td className="p-2">Insurance</td>
                      <td className="p-2 text-right">{formatCurrency(invoice.summary.insurance)}</td>
                    </tr>
                    <tr className="border-l border-r border-gray-200">
                      <td className="p-2">Other Amount</td>
                      <td className="p-2 text-right">{formatCurrency(invoice.summary.other)}</td>
                    </tr>
                    <tr className="border border-gray-200 font-bold">
                      <td className="p-2">Net Amount</td>
                      <td className="p-2 text-right">{formatCurrency(invoice.summary.netAmount)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mt-6 p-3 border border-gray-200">
                <p className="font-bold">Notes:</p>
                <p>{invoice.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>Thank you for your business!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceDetail;
