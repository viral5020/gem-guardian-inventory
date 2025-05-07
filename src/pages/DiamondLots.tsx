
import { useState } from "react";
import Navbar from "@/components/Navbar";
import LotDashboard from "@/components/LotDashboard";
import LotList from "@/components/LotList";
import LotDetail from "@/components/LotDetail";
import AddLotForm from "@/components/AddLotForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockLots } from "@/data/mockLots";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { DiamondLot } from "@/types/lot";
import { useToast } from "@/components/ui/use-toast";

const DiamondLots = () => {
  const [selectedLot, setSelectedLot] = useState<string | null>(null);
  const [isAddingLot, setIsAddingLot] = useState(false);
  const [refresh, setRefresh] = useState(0); // Force refresh when lots change
  const { toast } = useToast();
  
  const lot = selectedLot ? mockLots.find(d => d.id === selectedLot) : null;
  
  const handleAddLot = () => {
    setIsAddingLot(true);
  };

  const handleCancelAddLot = () => {
    setIsAddingLot(false);
  };
  
  const handleLotAdded = (newLot: DiamondLot) => {
    setIsAddingLot(false);
    setSelectedLot(newLot.id);
    setRefresh(prev => prev + 1); // Force refresh to show new lot
    
    toast({
      title: "Lot Added Successfully",
      description: `Lot ${newLot.lotId} has been added to the inventory.`,
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Diamond Lots</h1>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/">Individual Diamonds</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/customers">Customer Management</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/analytics">Analytics & Reports</Link>
            </Button>
          </div>
        </div>
        
        {isAddingLot ? (
          <AddLotForm 
            onCancel={handleCancelAddLot} 
            onSuccess={handleLotAdded}
          />
        ) : lot ? (
          <LotDetail 
            lotId={lot.id} 
            onBack={() => setSelectedLot(null)} 
          />
        ) : (
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="inventory">All Lots</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard">
              <LotDashboard onSelectLot={setSelectedLot} />
            </TabsContent>
            <TabsContent value="inventory">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Lot Inventory</h2>
                  <Button onClick={handleAddLot}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Lot
                  </Button>
                </div>
                <LotList 
                  key={`lot-list-${refresh}`} // Force re-render when lots change
                  onSelectLot={setSelectedLot}
                  onAddLot={handleAddLot}
                />
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default DiamondLots;
