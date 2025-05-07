
import React, { useState } from 'react';
import { DiamondLot, LotTransaction } from '@/types/lot';
import { mockLots, checkLotDiscrepancy } from '@/data/mockLots';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ArrowLeft, Package, AlertTriangle, User, Tag, Clock, Download } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AddLotTransactionForm from './AddLotTransactionForm';
import LotTransactionHistory from './LotTransactionHistory';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface LotDetailProps {
  lotId: string;
  onBack: () => void;
}

const LotDetail = ({ lotId, onBack }: LotDetailProps) => {
  const [lot, setLot] = useState<DiamondLot | undefined>(mockLots.find(l => l.id === lotId));
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  
  if (!lot) {
    return <div>Lot not found</div>;
  }
  
  const hasDiscrepancy = checkLotDiscrepancy(lot);
  const soldCarats = lot.transactions
    .filter(t => t.type === 'SALE')
    .reduce((sum, t) => sum + t.carats, 0);
  
  const returnedCarats = lot.transactions
    .filter(t => t.type === 'RETURN')
    .reduce((sum, t) => sum + t.carats, 0);
  
  const percentRemaining = Math.round((lot.remainingCarats / lot.totalCarats) * 100);

  const handleAddTransaction = () => {
    setIsAddingTransaction(true);
  };

  const handleCancelAddTransaction = () => {
    setIsAddingTransaction(false);
  };

  const handleTransactionAdded = (transaction: LotTransaction) => {
    setIsAddingTransaction(false);
    // In a real app, this would update the database
    // For now, we'll just update our local state
    const updatedLot = {
      ...lot,
      transactions: [...lot.transactions, transaction]
    };
    
    // Recalculate remaining carats
    if (transaction.type === 'SALE') {
      updatedLot.remainingCarats -= transaction.carats;
    } else if (transaction.type === 'RETURN') {
      updatedLot.remainingCarats += transaction.carats;
    }
    
    updatedLot.lastModified = new Date().toISOString();
    setLot(updatedLot);
  };

  const handleExport = () => {
    // In a real app, this would generate a CSV or Excel file
    console.log('Exporting lot details...');
    alert('Export functionality would generate a CSV/Excel file in a real application.');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Lots
          </Button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            {lot.lotId}
            {hasDiscrepancy && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Discrepancy Detected
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Lot Discrepancy</DialogTitle>
                    <DialogDescription>
                      The calculated remaining carats doesn't match the recorded value. This could indicate a tracking error.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <p><strong>Current recorded value:</strong> {lot.remainingCarats} carats</p>
                    <p><strong>Expected value based on transactions:</strong> {lot.totalCarats - soldCarats + returnedCarats} carats</p>
                    <p><strong>Discrepancy:</strong> {Math.abs(lot.remainingCarats - (lot.totalCarats - soldCarats + returnedCarats))} carats</p>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-1 h-4 w-4" />
            Export Details
          </Button>
          <Button onClick={handleAddTransaction}>
            Add Transaction
          </Button>
        </div>
      </div>

      {isAddingTransaction ? (
        <AddLotTransactionForm 
          lot={lot}
          onCancel={handleCancelAddTransaction}
          onSuccess={handleTransactionAdded}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Lot Summary</CardTitle>
              <CardDescription>Overview of the current lot status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Lot ID:</span>
                    <span>{lot.lotId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Handler:</span>
                    <span>{lot.handler}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Date Received:</span>
                    <span>{formatDate(lot.dateReceived)}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Source/Vendor:</span>
                    <p>{lot.source}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Initial Value:</span>
                    <p>{formatCurrency(lot.initialValue)}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium">Total Carats:</span>
                    <p className="text-2xl font-bold">{lot.totalCarats} ct</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Sold:</span>
                      <span className="text-sm">{soldCarats} ct</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Returned:</span>
                      <span className="text-sm">{returnedCarats} ct</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Remaining:</span>
                      <span className="text-sm font-bold">{lot.remainingCarats} ct</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${percentRemaining}%` }} 
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                      <span>0%</span>
                      <span>{percentRemaining}% Remaining</span>
                      <span>100%</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium">Status:</span>
                    <p>
                      {lot.remainingCarats === 0 ? (
                        <Badge variant="outline">Completed</Badge>
                      ) : lot.remainingCarats === lot.totalCarats ? (
                        <Badge>New</Badge>
                      ) : (
                        <Badge variant="secondary">Active</Badge>
                      )}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium">Last Modified:</span>
                    <p>{formatDate(lot.lastModified)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{lot.notes || "No notes available."}</p>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                Record of all sales, returns, and transfers for this lot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LotTransactionHistory transactions={lot.transactions} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LotDetail;
