
export type CutGrade = 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor';
export type ClarityGrade = 'FL' | 'IF' | 'VVS1' | 'VVS2' | 'VS1' | 'VS2' | 'SI1' | 'SI2' | 'I1' | 'I2' | 'I3';
export type ColorGrade = 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'Z+';
export type DiamondShape = 'Round' | 'Princess' | 'Cushion' | 'Emerald' | 'Oval' | 'Radiant' | 'Asscher' | 'Marquise' | 'Pear' | 'Heart';
export type FluorescenceGrade = 'None' | 'Faint' | 'Medium' | 'Strong' | 'Very Strong';
export type PolishGrade = 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor';
export type SymmetryGrade = 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor';
export type CertificationLab = 'GIA' | 'IGI' | 'AGS' | 'HRD' | 'None';
export type LocationStatus = 'Safe' | 'Showroom' | 'In Transit' | 'Customer Viewing' | 'Workshop';
export type InventoryStatus = 'Available' | 'Reserved' | 'Sold' | 'On Memo' | 'Returned';
export type ProcurementType = 'Direct Purchase' | 'Consignment' | 'Auction' | 'Mined';

export interface Diamond {
  id: string;
  sku: string;
  // 4Cs
  carat: number;
  cut: CutGrade;
  clarity: ClarityGrade;
  color: ColorGrade;
  // Additional properties
  shape: DiamondShape;
  fluorescence: FluorescenceGrade;
  polish: PolishGrade;
  symmetry: SymmetryGrade;
  // Certification
  certNumber: string;
  certLab: CertificationLab;
  // Tracking
  location: LocationStatus;
  status: InventoryStatus;
  procurementType: ProcurementType;
  procurementDate: string;
  // Business info
  costPrice: number;
  retailPrice: number;
  // Physical characteristics
  measurements: string; // in mm, length × width × depth
  depthPercentage: number;
  tablePercentage: number;
  // Origin information
  origin?: string;
  // Additional info
  notes?: string;
  images?: string[];
  lastModified: string;
  // Movement & History tracking
  movementHistory?: DiamondMovement[];
  // Kimberley Process certification
  kimberleyProcess?: boolean;
  // Laser inscription
  laserInscription?: string;
}

export interface DiamondMovement {
  id: string;
  date: string;
  fromLocation: LocationStatus;
  toLocation: LocationStatus;
  handledBy: string;
  notes?: string;
}

export interface DiamondFilter {
  shape?: DiamondShape;
  cutMin?: CutGrade;
  clarityMin?: ClarityGrade;
  colorMin?: ColorGrade;
  caratMin?: number;
  caratMax?: number;
  priceMin?: number;
  priceMax?: number;
  status?: InventoryStatus;
  certLab?: CertificationLab;
}

export interface DashboardMetric {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<React.SVGAttributes<SVGElement>>;
}

export interface DiamondSale {
  id: string;
  diamondId: string;
  saleDate: string;
  customerId: string;
  salePrice: number;
  paymentMethod: string;
  salesperson: string;
  notes?: string;
}

export interface DiamondMemo {
  id: string;
  diamondId: string;
  customerId: string;
  startDate: string;
  expectedEndDate: string;
  actualReturnDate?: string;
  status: 'Active' | 'Returned' | 'Sold' | 'Overdue';
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  customerType: 'Retail' | 'Wholesale' | 'Dealer';
  creditLimit?: number;
  notes?: string;
}
