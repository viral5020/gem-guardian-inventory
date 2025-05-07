
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { lotSummary } from '@/data/mockLots';
import { formatCurrency } from '@/lib/utils';
import { Package, ArrowUp, ArrowDown, Diamond } from 'lucide-react';
import LotList from './LotList';

interface LotDashboardProps {
  onSelectLot?: (lotId: string) => void;
}

const LotDashboard = ({ onSelectLot }: LotDashboardProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Total Lots</CardTitle>
              <CardDescription>All tracked lots</CardDescription>
            </div>
            <div className="bg-primary/10 p-2 rounded-full">
              <Package className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lotSummary.totalLots}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Total Value: {formatCurrency(lotSummary.totalValue)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Total Carats</CardTitle>
              <CardDescription>All diamonds in inventory</CardDescription>
            </div>
            <div className="bg-primary/10 p-2 rounded-full">
              <Diamond className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lotSummary.totalCarats} ct</div>
            <div className="text-xs text-muted-foreground mt-1">
              Across all lots
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Sold Carats</CardTitle>
              <CardDescription>Total diamonds sold</CardDescription>
            </div>
            <div className="bg-destructive/10 p-2 rounded-full">
              <ArrowUp className="h-4 w-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lotSummary.soldCarats} ct</div>
            <div className="text-xs text-muted-foreground mt-1">
              {((lotSummary.soldCarats / lotSummary.totalCarats) * 100).toFixed(1)}% of total inventory
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Remaining</CardTitle>
              <CardDescription>Available carats</CardDescription>
            </div>
            <div className="bg-primary/10 p-2 rounded-full">
              <Package className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lotSummary.remainingCarats} ct</div>
            <div className="text-xs text-muted-foreground mt-1">
              {((lotSummary.remainingCarats / lotSummary.totalCarats) * 100).toFixed(1)}% of total inventory
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="py-4">
        <h2 className="text-xl font-bold mb-4">Recent Lots</h2>
        <LotList 
          showFilters={false} 
          limit={5} 
          onSelectLot={onSelectLot}
        />
      </div>
    </div>
  );
};

export default LotDashboard;
