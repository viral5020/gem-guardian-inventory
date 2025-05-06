
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
import { Link } from "react-router-dom";
import { Diamond } from "@/types/diamond";

const Index = () => {
  const [selectedDiamond, setSelectedDiamond] = useState<string | null>(null);
  const [isAddingDiamond, setIsAddingDiamond] = useState(false);
  const [refresh, setRefresh] = useState(0); // Force refresh when diamonds change
  
  const diamond = selectedDiamond ? mockDiamonds.find(d => d.id === selectedDiamond) : null;
  
  const handleAddDiamond = () => {
    setIsAddingDiamond(true);
  };

  const handleCancelAddDiamond = () => {
    setIsAddingDiamond(false);
  };
  
  const handleDiamondAdded = (newDiamond: Diamond) => {
    setIsAddingDiamond(false);
    setSelectedDiamond(newDiamond.id);
    setRefresh(prev => prev + 1); // Force refresh to show new diamond
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
        <div className="mb-6 flex items-center justify-end space-x-2">
          <Button variant="outline" asChild>
            <Link to="/customers">Customer Management</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/analytics">Analytics & Reports</Link>
          </Button>
        </div>
        
        {isAddingDiamond ? (
          <AddDiamondForm 
            onCancel={handleCancelAddDiamond} 
            onSuccess={handleDiamondAdded}
          />
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
                  key={`diamond-list-${refresh}`} // Force re-render when diamonds change
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
