
import { Diamond, Package, DollarSign, ShoppingBag } from "lucide-react";
import DashboardCard from "./DashboardCard";
import { totalDiamonds, availableDiamonds, onMemoDiamonds, totalInventoryValue } from "@/data/mockDiamonds";
import DiamondList from "./DiamondList";
import { formatCurrency } from "@/lib/utils";

interface DashboardProps {
  onSelectDiamond?: (diamondId: string) => void;
}

const Dashboard = ({ onSelectDiamond }: DashboardProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard 
          title="Total Diamonds" 
          value={totalDiamonds}
          icon={Diamond} 
          change={2.5} 
        />
        <DashboardCard 
          title="Available" 
          value={availableDiamonds}
          icon={Package} 
          change={-1.8} 
        />
        <DashboardCard 
          title="On Memo" 
          value={onMemoDiamonds}
          icon={ShoppingBag} 
          change={5.2} 
        />
        <DashboardCard 
          title="Inventory Value" 
          value={formatCurrency(totalInventoryValue)}
          icon={DollarSign} 
          change={3.7} 
        />
      </div>
      
      <div className="py-4">
        <h2 className="text-xl font-bold mb-4">Recently Added Diamonds</h2>
        <DiamondList 
          showFilters={false} 
          limit={5} 
          onSelectDiamond={onSelectDiamond}
        />
      </div>
    </div>
  );
};

export default Dashboard;
