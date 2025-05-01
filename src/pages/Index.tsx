
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Dashboard from "@/components/Dashboard";
import DiamondList from "@/components/DiamondList";
import DiamondDetail from "@/components/DiamondDetail";
import AddDiamondForm from "@/components/AddDiamondForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockDiamonds } from "@/data/mockDiamonds";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Index = () => {
  const [selectedDiamond, setSelectedDiamond] = useState<string | null>(null);
  const [isAddingDiamond, setIsAddingDiamond] = useState(false);
  
  const diamond = selectedDiamond ? mockDiamonds.find(d => d.id === selectedDiamond) : null;
  
  const handleAddDiamond = () => {
    setIsAddingDiamond(true);
  };

  const handleCancelAddDiamond = () => {
    setIsAddingDiamond(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
        {isAddingDiamond ? (
          <AddDiamondForm onCancel={handleCancelAddDiamond} />
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
              <Dashboard onSelectDiamond={setSelectedDiamond} />
            </TabsContent>
            <TabsContent value="inventory">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold">Diamond Inventory</h1>
                  <Button
                    onClick={handleAddDiamond}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Diamond
                  </Button>
                </div>
                <DiamondList 
                  onSelectDiamond={setSelectedDiamond}
                  onAddDiamond={handleAddDiamond}
                />
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default Index;
