
import React, { useState } from 'react';
import { DiamondLot, LotFilter } from '@/types/lot';
import { mockLots, checkLotDiscrepancy } from '@/data/mockLots';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { AlertTriangle, Search, Download, Package, User, FileSearch } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LotListProps {
  onSelectLot?: (lotId: string) => void;
  onAddLot?: () => void;
  showFilters?: boolean;
  limit?: number;
}

const LotList = ({ onSelectLot, onAddLot, showFilters = true, limit }: LotListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<LotFilter>({ status: 'ALL' });
  
  // Filter lots based on search term and filters
  const filteredLots = mockLots
    .filter(lot => {
      // Search term filter
      if (searchTerm && !lot.lotId.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !lot.source.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !lot.handler.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Status filter
      if (filter.status === 'ACTIVE' && lot.remainingCarats <= 0) {
        return false;
      }
      if (filter.status === 'COMPLETED' && lot.remainingCarats > 0) {
        return false;
      }
      
      // Handler filter
      if (filter.handler && lot.handler !== filter.handler) {
        return false;
      }
      
      return true;
    })
    .slice(0, limit || undefined);

  const handleExport = () => {
    // In a real app, this would generate a CSV or Excel file
    console.log('Exporting lots data...');
    alert('Export functionality would generate a CSV/Excel file in a real application.');
  };

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by ID, source or handler..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setFilter({ ...filter, status: 'ALL' })}
              className={filter.status === 'ALL' ? "bg-primary text-primary-foreground" : ""}
            >
              All Lots
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setFilter({ ...filter, status: 'ACTIVE' })}
              className={filter.status === 'ACTIVE' ? "bg-primary text-primary-foreground" : ""}
            >
              Active
            </Button>
            <Button 
              variant="outline"
              onClick={() => setFilter({ ...filter, status: 'COMPLETED' })}
              className={filter.status === 'COMPLETED' ? "bg-primary text-primary-foreground" : ""}
            >
              Completed
            </Button>
          </div>
          <Button onClick={handleExport}>
            <Download className="mr-1 h-4 w-4" />
            Export
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lot ID</TableHead>
              <TableHead>Total Carats</TableHead>
              <TableHead>Remaining</TableHead>
              <TableHead>Handler</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Date Received</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLots.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No lots found.
                </TableCell>
              </TableRow>
            ) : (
              filteredLots.map((lot) => {
                const hasDiscrepancy = checkLotDiscrepancy(lot);
                const percentRemaining = Math.round((lot.remainingCarats / lot.totalCarats) * 100);
                
                return (
                  <TableRow 
                    key={lot.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onSelectLot && onSelectLot(lot.id)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-primary" />
                        {lot.lotId}
                        {hasDiscrepancy && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Discrepancy detected</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{lot.totalCarats} ct</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16">{lot.remainingCarats} ct</div>
                        <div className="w-full max-w-24 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${percentRemaining}%` }} 
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">{percentRemaining}%</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {lot.handler}
                      </div>
                    </TableCell>
                    <TableCell>{lot.source}</TableCell>
                    <TableCell>{formatDate(lot.dateReceived)}</TableCell>
                    <TableCell>{formatCurrency(lot.initialValue)}</TableCell>
                    <TableCell>
                      {lot.remainingCarats === 0 ? (
                        <Badge variant="outline">Completed</Badge>
                      ) : lot.remainingCarats === lot.totalCarats ? (
                        <Badge>New</Badge>
                      ) : (
                        <Badge variant="secondary">Active</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LotList;
