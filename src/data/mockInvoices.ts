import { Invoice, InvoiceItem, InvoiceSummary } from '@/types/invoice';

// Mock invoice items
const createMockItems = (invoiceId: string): InvoiceItem[] => [
  {
    id: `item-${invoiceId}-1`,
    certificateId: "NC-GOOD-0001",
    description: "Carat VS1 Blue Blue 3.45",
    serialNumber: "1",
    quantity: 1,
    unit: "C",
    carat: 0.4000,
    unitPrice: 2100.00,
    amount: 945.00
  },
  {
    id: `item-${invoiceId}-2`,
    certificateId: "NC-GOOD-0002",
    description: "Carat VS1 Blue Blue 3.45",
    serialNumber: "2",
    quantity: 1,
    unit: "C",
    carat: 0.4000,
    unitPrice: 2100.00,
    amount: 945.00
  },
  {
    id: `item-${invoiceId}-3`,
    certificateId: "NC-GOOD-0003",
    description: "Carat VS1 Blue Blue 3.45",
    serialNumber: "3",
    quantity: 1,
    unit: "C",
    carat: 0.4000,
    unitPrice: 2100.00,
    amount: 945.00
  }
];

// Mock invoices
export const mockInvoices: Invoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "INV-2023-001",
    page: 1,
    totalPages: 1,
    invoiceDate: "2023-01-10",
    dueDate: "2023-01-25",
    terms: "Net 15",
    vendorInvoice: "VDRINV123",
    vendorInvoiceDate: "2023-01-05",
    shipVia: "UPS",
    purchaseOrder: "PO-2023-001",
    customerId: "cust-1",
    customerName: "Tiffany & Co.",
    customerAddress: "727 Fifth Avenue, New York, NY 10022",
    customerPhone: "+1 212-755-8000",
    customerEmail: "orders@tiffany.com",
    items: createMockItems("inv-1"),
    summary: {
      subtotal: 2835.00,
      discount: 0.00,
      salesTax: 0.00,
      vat: 0.00,
      shipping: 0.00,
      insurance: 0.00,
      other: 0.00,
      netAmount: 2835.00
    },
    status: "PAID",
    createdAt: "2023-01-10T10:30:00Z",
    updatedAt: "2023-01-11T15:45:00Z",
    paidAt: "2023-01-20T09:15:00Z"
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-2023-002",
    page: 1,
    totalPages: 1,
    invoiceDate: "2023-02-15",
    dueDate: "2023-03-15",
    terms: "Net 30",
    customerId: "cust-2",
    customerName: "Cartier",
    customerAddress: "653 Fifth Avenue, New York, NY 10022",
    customerPhone: "+1 212-446-3400",
    customerEmail: "orders@cartier.com",
    items: createMockItems("inv-2"),
    summary: {
      subtotal: 2835.00,
      discount: 283.50,
      salesTax: 191.36,
      vat: 0.00,
      shipping: 25.00,
      insurance: 75.00,
      other: 0.00,
      netAmount: 2842.86
    },
    status: "SENT",
    createdAt: "2023-02-15T11:20:00Z",
    updatedAt: "2023-02-15T11:20:00Z"
  },
  {
    id: "inv-3",
    invoiceNumber: "INV-2023-003",
    page: 1,
    totalPages: 1,
    invoiceDate: "2023-03-20",
    dueDate: "2023-04-04",
    terms: "Net 15",
    purchaseOrder: "PO-2023-027",
    customerId: "cust-3",
    customerName: "Blue Nile",
    customerAddress: "411 First Avenue, Seattle, WA 98109",
    customerPhone: "+1 206-336-6700",
    customerEmail: "orders@bluenile.com",
    items: createMockItems("inv-3"),
    summary: {
      subtotal: 2835.00,
      discount: 0.00,
      salesTax: 248.06,
      vat: 0.00,
      shipping: 0.00,
      insurance: 50.00,
      other: 0.00,
      netAmount: 3133.06
    },
    status: "OVERDUE",
    createdAt: "2023-03-20T09:00:00Z",
    updatedAt: "2023-03-20T09:00:00Z"
  }
];

// Generate a new invoice number based on the current year and latest invoice
export function generateInvoiceNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const latestInvoiceNum = mockInvoices
    .filter(inv => inv.invoiceNumber.includes(year.toString()))
    .length + 1;
  
  return `INV-${year}-${String(latestInvoiceNum).padStart(3, '0')}`;
}

// Calculate invoice summary totals based on items
export function calculateInvoiceSummary(
  items: InvoiceItem[], 
  discount: number = 0, 
  taxRate: number = 0.08,
  shipping: number = 0,
  insurance: number = 0,
  other: number = 0
): InvoiceSummary {
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const salesTax = taxRate * (subtotal - discount);
  
  return {
    subtotal,
    discount,
    salesTax,
    vat: 0, // Set VAT as needed
    shipping,
    insurance,
    other,
    netAmount: subtotal - discount + salesTax + shipping + insurance + other
  };
}
