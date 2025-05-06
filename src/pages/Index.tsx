
import Dashboard from "@/components/Dashboard";
import { useState } from "react";
import DiamondDetail from "@/components/DiamondDetail";
import { mockDiamonds } from "@/data/mockDiamonds";

const Index = () => {
  const [selectedDiamond, setSelectedDiamond] = useState<string | null>(null);
  
  const diamond = selectedDiamond ? mockDiamonds.find(d => d.id === selectedDiamond) : null;
  
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      {diamond ? (
        <DiamondDetail 
          diamond={diamond} 
          onBack={() => setSelectedDiamond(null)} 
        />
      ) : (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Dashboard onSelectDiamond={setSelectedDiamond} />
        </div>
      )}
    </div>
  );
};

export default Index;
