
import { DiamondLot, LotTransaction } from '../types/lot';

// Helper function to generate lot IDs
export const generateLotId = (): string => {
  const prefix = 'LOT';
  const year = new Date().getFullYear().toString().substring(2);
  const randomDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${year}-${randomDigits}`;
};

// Mock transactions for our lots
const mockTransactions: Record<string, LotTransaction[]> = {
  '1': [
    {
      id: 't1',
      lotId: '1',
      type: 'SALE',
      date: '2025-02-10',
      carats: 2.5,
      handler: 'Emma Johnson',
      customer: 'Diamond Wholesalers Inc.',
      price: 12500,
      notes: 'Sale of 2.5 carats for custom engagement ring'
    },
    {
      id: 't2',
      lotId: '1',
      type: 'SALE',
      date: '2025-03-15',
      carats: 3.2,
      handler: 'Michael Chen',
      customer: 'Luxury Jewelers',
      price: 16800,
      notes: 'Bulk purchase for earring collection'
    }
  ],
  '2': [
    {
      id: 't3',
      lotId: '2',
      type: 'SALE',
      date: '2025-02-28',
      carats: 1.8,
      handler: 'Emma Johnson',
      customer: 'Elite Gems',
      price: 7200,
      notes: 'Selected for pendant design'
    },
    {
      id: 't4',
      lotId: '2',
      type: 'RETURN',
      date: '2025-03-05',
      carats: 0.5,
      handler: 'David Wilson',
      customer: 'Elite Gems',
      notes: 'Customer returned portion of lot due to size requirements'
    }
  ],
  '3': [],
  '4': [
    {
      id: 't5',
      lotId: '4',
      type: 'TRANSFER',
      date: '2025-04-01',
      carats: 12.0,
      handler: 'Michael Chen',
      notes: 'Transferred to cutting facility'
    },
    {
      id: 't6',
      lotId: '4',
      type: 'RETURN',
      date: '2025-04-08',
      carats: 5.8,
      handler: 'Michael Chen',
      notes: 'Return from cutting - remaining material after processing'
    },
    {
      id: 't7',
      lotId: '4',
      type: 'SALE',
      date: '2025-04-15',
      carats: 5.8,
      handler: 'Emma Johnson',
      customer: 'Diamond Exchange',
      price: 29000,
      notes: 'Sale of remaining material after cutting'
    }
  ]
};

// Helper function to check if there's a discrepancy in lot data
export const checkLotDiscrepancy = (lot: DiamondLot): boolean => {
  const soldCarats = lot.transactions
    .filter(t => t.type === 'SALE')
    .reduce((sum, t) => sum + t.carats, 0);
  
  const returnedCarats = lot.transactions
    .filter(t => t.type === 'RETURN')
    .reduce((sum, t) => sum + t.carats, 0);
  
  const calculatedRemaining = lot.totalCarats - soldCarats + returnedCarats;
  
  // Check if there's a difference greater than a small tolerance
  return Math.abs(calculatedRemaining - lot.remainingCarats) > 0.01;
};

// Mock diamond lots
export const mockLots: DiamondLot[] = [
  {
    id: '1',
    lotId: 'LOT-24-0001',
    totalCarats: 10.0,
    remainingCarats: 4.3,
    dateReceived: '2025-01-15',
    source: 'African Diamond Suppliers',
    initialValue: 45000,
    handler: 'Emma Johnson',
    notes: 'High quality rough diamonds from Botswana',
    lastModified: '2025-03-15',
    transactions: mockTransactions['1']
  },
  {
    id: '2',
    lotId: 'LOT-24-0002',
    totalCarats: 5.0,
    remainingCarats: 3.7, // Intentional discrepancy for testing
    dateReceived: '2025-02-01',
    source: 'Canadian Mines Ltd',
    initialValue: 22000,
    handler: 'David Wilson',
    notes: 'Ethically sourced Canadian diamonds',
    lastModified: '2025-03-05',
    transactions: mockTransactions['2']
  },
  {
    id: '3',
    lotId: 'LOT-24-0003',
    totalCarats: 8.5,
    remainingCarats: 8.5,
    dateReceived: '2025-03-10',
    source: 'Antwerp Diamond Exchange',
    initialValue: 36500,
    handler: 'Michael Chen',
    notes: 'Newly arrived, not yet processed',
    lastModified: '2025-03-10',
    transactions: mockTransactions['3']
  },
  {
    id: '4',
    lotId: 'LOT-24-0004',
    totalCarats: 15.0,
    remainingCarats: 0.0,
    dateReceived: '2025-03-20',
    source: 'Russian Diamond Corp',
    initialValue: 68000,
    handler: 'Michael Chen',
    notes: 'Premium quality rough diamonds, fully processed',
    lastModified: '2025-04-15',
    transactions: mockTransactions['4']
  }
];

// Summary statistics
export const totalLots = mockLots.length;
export const activeLots = mockLots.filter(lot => lot.remainingCarats > 0).length;
export const completedLots = mockLots.filter(lot => lot.remainingCarats === 0).length;
export const totalCaratsInStock = mockLots.reduce((sum, lot) => sum + lot.remainingCarats, 0);
export const totalLotValue = mockLots.reduce((sum, lot) => sum + lot.initialValue, 0);
