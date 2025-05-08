
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LotMetric } from '@/types/lot';
import DashboardCard from '@/components/DashboardCard';
import LotList from '@/components/LotList';
import { Package, ArrowUpDown, Scale, DollarSign, Clock } from 'lucide-react';
import { totalLots, activeLots, completedLots, totalCaratsInStock, totalLotValue } from '@/data/mockLots';
import { formatCurrency } from '@/lib/utils';

interface LotDashboardProps {
  onSelectLot?: (lotId: string) => void;
}

const LotDashboard = ({ onSelectLot }: LotDashboardProps) => {
  const metrics: LotMetric[] = [
    {
      title: 'Total Diamond Lots',
      value: totalLots,
      icon: Package,
    },
    {
      title: 'Active Lots',
      value: activeLots,
      icon: ArrowUpDown,
    },
    {
      title: 'Completed Lots',
      value: completedLots,
      icon: Clock,
    },
    {
      title: 'Carats in Stock',
      value: `${totalCaratsInStock.toFixed(2)} ct`,
      icon: Scale,
    },
    {
      title: 'Total Lot Value',
      value: formatCurrency(totalLotValue),
      icon: DollarSign,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {metrics.map((metric, index) => (
          <DashboardCard key={index} metric={metric} />
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Diamond Lots</CardTitle>
          <CardDescription>
            View and manage your recent diamond lots
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LotList onSelectLot={onSelectLot} showFilters={false} limit={5} />
        </CardContent>
        <CardFooter className="border-t bg-muted/50 px-6 py-3">
          <p className="text-xs text-muted-foreground">
            Showing 5 most recent lots. View all lots for complete inventory.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LotDashboard;
