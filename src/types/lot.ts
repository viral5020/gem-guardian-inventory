
export interface DiamondLot {
  id: string;
  lotId: string; // Unique identifier like LOT-2025-001
  totalCarats: number;
  dateReceived: string;
  source: string;
  initialValue: number;
  remainingCarats: number;
  handler: string;
  notes?: string;
  lastModified: string;
  transactions: LotTransaction[];
}

export interface LotTransaction {
  id: string;
  lotId: string;
  date: string;
  type: 'SALE' | 'RETURN' | 'TRANSFER';
  carats: number;
  handler: string;
  customer?: string;
  price?: number;
  reason?: string;
  notes?: string;
}

export interface LotFilter {
  handler?: string;
  status?: 'ALL' | 'ACTIVE' | 'COMPLETED';
  dateFrom?: string;
  dateTo?: string;
  source?: string;
}

export type LotSummary = {
  totalLots: number;
  totalCarats: number;
  soldCarats: number;
  returnedCarats: number;
  remainingCarats: number;
  totalValue: number;
}
