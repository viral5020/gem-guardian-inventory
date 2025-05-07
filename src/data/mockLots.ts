
import { DiamondLot, LotSummary, LotTransaction } from '../types/lot';

// Mock transactions for each lot
const lotTransactions: Record<string, LotTransaction[]> = {
  '1': [
    {
      id: 't1',
      lotId: '1',
      date: '2025-01-20',
      type: 'SALE',
      carats: 100,
      handler: 'John Doe',
      customer: 'Tiffany & Co',
      price: 55000,
      notes: 'Bulk purchase for new collection'
    },
    {
      id: 't2',
      lotId: '1',
      date: '2025-02-05',
      type: 'SALE',
      carats: 200,
      handler: 'Emma Johnson',
      customer: 'Cartier',
      price: 110000,
      notes: 'Special order'
    },
    {
      id: 't3',
      lotId: '1',
      date: '2025-02-15',
      type: 'RETURN',
      carats: 50,
      handler: 'John Doe',
      customer: 'Tiffany & Co',
      reason: 'Quality issues with some pieces',
      notes: 'Customer found inclusions in 5 stones'
    }
  ],
  '2': [
    {
      id: 't4',
      lotId: '2',
      date: '2025-02-25',
      type: 'SALE',
      carats: 75,
      handler: 'Michael Chen',
      customer: 'Blue Nile',
      price: 48750,
      notes: 'Online inventory restock'
    },
    {
      id: 't5',
      lotId: '2',
      date: '2025-03-10',
      type: 'TRANSFER',
      carats: 25,
      handler: 'David Wilson',
      notes: 'Transferred to New York office'
    }
  ],
  '3': [
    {
      id: 't6',
      lotId: '3',
      date: '2025-04-05',
      type: 'SALE',
      carats: 150,
      handler: 'Emma Johnson',
      customer: 'Harry Winston',
      price: 112500,
      notes: 'Premier collection pieces'
    }
  ]
};

// Create mock lots with their transactions
export const mockLots: DiamondLot[] = [
  {
    id: '1',
    lotId: 'LOT-2025-001',
    totalCarats: 500,
    dateReceived: '2025-01-15',
    source: 'De Beers',
    initialValue: 250000,
    remainingCarats: 250,
    handler: 'John Doe',
    notes: 'High quality rough diamonds from Botswana',
    lastModified: '2025-02-15',
    transactions: lotTransactions['1']
  },
  {
    id: '2',
    lotId: 'LOT-2025-002',
    totalCarats: 300,
    dateReceived: '2025-02-20',
    source: 'ALROSA',
    initialValue: 180000,
    remainingCarats: 200,
    handler: 'Michael Chen',
    notes: 'Mixed quality, primarily for commercial jewelry',
    lastModified: '2025-03-10',
    transactions: lotTransactions['2']
  },
  {
    id: '3',
    lotId: 'LOT-2025-003',
    totalCarats: 250,
    dateReceived: '2025-03-30',
    source: 'Rio Tinto',
    initialValue: 187500,
    remainingCarats: 100,
    handler: 'Emma Johnson',
    notes: 'Premium quality from Argyle mine',
    lastModified: '2025-04-05',
    transactions: lotTransactions['3']
  },
  {
    id: '4',
    lotId: 'LOT-2025-004',
    totalCarats: 600,
    dateReceived: '2025-04-10',
    source: 'Petra Diamonds',
    initialValue: 330000,
    remainingCarats: 600,
    handler: 'David Wilson',
    notes: 'New acquisition, not yet processed',
    lastModified: '2025-04-10',
    transactions: []
  }
];

export const lotSummary: LotSummary = {
  totalLots: mockLots.length,
  totalCarats: mockLots.reduce((sum, lot) => sum + lot.totalCarats, 0),
  soldCarats: mockLots.reduce((sum, lot) => sum + lot.transactions.filter(t => t.type === 'SALE').reduce((s, t) => s + t.carats, 0), 0),
  returnedCarats: mockLots.reduce((sum, lot) => sum + lot.transactions.filter(t => t.type === 'RETURN').reduce((s, t) => s + t.carats, 0), 0),
  remainingCarats: mockLots.reduce((sum, lot) => sum + lot.remainingCarats, 0),
  totalValue: mockLots.reduce((sum, lot) => sum + lot.initialValue, 0)
};

// Generate a new lot ID based on the current year and month
export function generateLotId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const sequence = String(mockLots.length + 1).padStart(3, '0');
  return `LOT-${year}-${month}-${sequence}`;
}

// Calculate remaining carats in a lot
export function calculateRemainingCarats(lot: DiamondLot): number {
  const sold = lot.transactions
    .filter(t => t.type === 'SALE')
    .reduce((sum, t) => sum + t.carats, 0);
  
  const returned = lot.transactions
    .filter(t => t.type === 'RETURN')
    .reduce((sum, t) => sum + t.carats, 0);
  
  return lot.totalCarats - sold + returned;
}

// Check if a lot has any discrepancies
export function checkLotDiscrepancy(lot: DiamondLot): boolean {
  const calculatedRemaining = calculateRemainingCarats(lot);
  return calculatedRemaining !== lot.remainingCarats;
}
