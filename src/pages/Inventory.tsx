
import { useState } from "react";
import DiamondList from "@/components/DiamondList";
import DiamondDetail from "@/components/DiamondDetail";
import AddDiamondForm from "@/components/AddDiamondForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Diamond } from "@/types/diamond";
import { mockDiamonds } from "@/data/mockDiamonds";

const Inventory = () => {
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
    <div className="space-y-6">
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
      )}
    </div>
  );
};

export default Inventory;
