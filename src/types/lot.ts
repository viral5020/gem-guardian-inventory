
export interface DiamondLot {
  id: string;
  lotId: string;
  totalCarats: number;
  remainingCarats: number;
  dateReceived: string;
  source: string;
  initialValue: number;
  handler: string;
  notes?: string;
  lastModified: string;
  transactions: LotTransaction[];
}

export interface LotTransaction {
  id: string;
  lotId: string;
  type: 'SALE' | 'RETURN' | 'TRANSFER';
  date: string;
  carats: number;
  handler: string;
  customer?: string;
  price?: number;
  notes?: string;
}

export type LotFilter = {
  status?: 'ALL' | 'ACTIVE' | 'COMPLETED';
  handler?: string;
};

export interface LotMetric {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<React.SVGAttributes<SVGElement>>;
}
