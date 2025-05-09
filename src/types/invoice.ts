
export interface InvoiceItem {
  id: string;
  lotId?: string;
  certificateId?: string;
  description: string;
  serialNumber?: string;
  quantity: number;
  unit: string;
  carat?: number;
  unitPrice: number;
  amount: number;
}

export interface InvoiceSummary {
  subtotal: number;
  discount: number;
  salesTax: number;
  vat: number;
  shipping: number;
  insurance: number;
  other: number;
  netAmount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  page: number;
  totalPages: number;
  invoiceDate: string;
  dueDate: string;
  terms: string;
  vendorInvoice?: string;
  vendorInvoiceDate?: string;
  shipVia?: string;
  purchaseOrder?: string;
  tracking?: string;
  customerId: string;
  customerName: string;
  customerAddress: string;
  customerPhone?: string;
  customerEmail?: string;
  items: InvoiceItem[];
  notes?: string;
  summary: InvoiceSummary;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
}
