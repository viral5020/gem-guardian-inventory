
import { useState } from "react";
import Navbar from "@/components/Navbar";
import CustomerManagement from "@/components/CustomerManagement";
import DiamondMemoManagement from "@/components/DiamondMemoManagement";
import { toast } from "@/components/ui/use-toast";
import { Customer, DiamondMemo } from "@/types/diamond";

// Mock data for the customer page
const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "(555) 123-4567",
    company: "Smith Jewelers",
    address: "123 Main St, New York, NY",
    customerType: "Retail",
    creditLimit: 10000,
    notes: "Prefers Princess cut diamonds"
  },
  {
    id: "2",
    name: "Robert Johnson",
    email: "robert@jjdiamonds.com",
    phone: "(555) 987-6543",
    company: "JJ Diamonds",
    address: "456 Market St, Chicago, IL",
    customerType: "Wholesale",
    creditLimit: 50000,
    notes: "Bulk orders monthly"
  },
  {
    id: "3",
    name: "Sarah Williams",
    email: "swilliams@luxejewels.com",
    phone: "(555) 456-7890",
    company: "Luxe Jewels",
    address: "789 Broadway, Los Angeles, CA",
    customerType: "Dealer",
    creditLimit: 100000,
    notes: "VIP client, prefers top quality"
  },
  {
    id: "4",
    name: "Michael Brown",
    email: "michael@browndiamond.com",
    phone: "(555) 234-5678",
    company: "Brown Diamond Co.",
    address: "234 Oak St, Dallas, TX",
    customerType: "Wholesale",
    creditLimit: 75000,
    notes: "Specialized in colored diamonds"
  }
];

const mockMemos: DiamondMemo[] = [
  {
    id: "1",
    diamondId: "1",
    customerId: "1",
    startDate: "2025-04-20",
    expectedEndDate: "2025-04-27",
    status: "Active",
    notes: "Client interested in setting as engagement ring"
  },
  {
    id: "2",
    diamondId: "3",
    customerId: "2",
    startDate: "2025-04-15",
    expectedEndDate: "2025-04-22",
    actualReturnDate: "2025-04-21",
    status: "Returned",
    notes: "Client decided on a different stone"
  },
  {
    id: "3",
    diamondId: "4",
    customerId: "3",
    startDate: "2025-04-10",
    expectedEndDate: "2025-04-17",
    status: "Sold",
    notes: "Purchased for custom pendant design"
  },
  {
    id: "4",
    diamondId: "2",
    customerId: "4",
    startDate: "2025-04-01",
    expectedEndDate: "2025-04-08",
    status: "Overdue",
    notes: "Follow-up call scheduled"
  }
];

const Customers = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  
  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomer(customerId);
    toast({
      title: "Customer Selected",
      description: `Customer ID: ${customerId}`
    });
  };
  
  const handleAddCustomer = () => {
    toast({
      title: "Add Customer",
      description: "This would open a customer creation form"
    });
  };
  
  const handleMarkReturned = (memoId: string) => {
    toast({
      title: "Memo Updated",
      description: `Memo ${memoId} marked as returned`
    });
  };
  
  const handleMarkSold = (memoId: string) => {
    toast({
      title: "Memo Updated",
      description: `Memo ${memoId} marked as sold`
    });
  };

  const customer = selectedCustomer 
    ? mockCustomers.find(c => c.id === selectedCustomer)
    : null;

  const customerMemos = mockMemos.filter(
    memo => customer && memo.customerId === customer.id
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Customer Relationship Management</h1>
          
          {customer ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{customer.name}</h2>
                <Button variant="outline" onClick={() => setSelectedCustomer(null)}>
                  Back to All Customers
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Contact Information</p>
                      <p className="font-medium">{customer.email}</p>
                      <p className="font-medium">{customer.phone}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Company</p>
                      <p className="font-medium">{customer.company || "N/A"}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{customer.address || "N/A"}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Customer Type</p>
                      <Badge>{customer.customerType}</Badge>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Credit Limit</p>
                      <p className="font-medium">{formatCurrency(customer.creditLimit || 0)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Notes</p>
                      <p>{customer.notes || "No notes available."}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <DiamondMemoManagement 
                memos={customerMemos} 
                customers={mockCustomers} 
                onMarkReturned={handleMarkReturned}
                onMarkSold={handleMarkSold}
              />
            </div>
          ) : (
            <CustomerManagement 
              customers={mockCustomers}
              onAddCustomer={handleAddCustomer}
              onSelectCustomer={handleSelectCustomer}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Customers;
