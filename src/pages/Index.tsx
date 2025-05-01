
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Dashboard from "@/components/Dashboard";
import DiamondList from "@/components/DiamondList";
import DiamondDetail from "@/components/DiamondDetail";
import AddDiamondForm from "@/components/AddDiamondForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockDiamonds } from "@/data/mockDiamonds";

const Index = () => {
  const [selectedDiamond, setSelectedDiamond] = useState<string | null>(null);
  const [isAddingDiamond, setIsAddingDiamond] = useState(false);
  
  const diamond = selectedDiamond ? mockDiamonds.find(d => d.id === selectedDiamond) : null;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
        {isAddingDiamond ? (
          <AddDiamondForm />
        ) : diamond ? (
          <DiamondDetail 
            diamond={diamond} 
            onBack={() => setSelectedDiamond(null)} 
          />
        ) : (
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard">
              <Dashboard />
            </TabsContent>
            <TabsContent value="inventory">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold">Diamond Inventory</h1>
                  <button 
                    className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2"
                    onClick={() => setIsAddingDiamond(true)}
                  >
                    Add New Diamond
                  </button>
                </div>
                <DiamondList />
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default Index;
