export enum BuyBoxStatus {
  WON = 'WON',
  LOST = 'LOST',
  SUPPRESSED = 'SUPPRESSED',
}

export interface RawKeepaRow {
  [key: string]: string | number | undefined;
  
  // Standard Keepa Export Columns
  ASIN?: string;
  asin?: string;
  
  Title?: string;
  title?: string;

  Image?: string;
  image?: string;
  
  // Specific Headers from provided CSV
  "Buy Box 🚚: Current"?: string;
  "Buy Box: Buy Box Seller"?: string;
  "New: Current"?: string;

  // Fallbacks for other export types
  "Buy Box Seller"?: string;
  "Buy Box Price"?: string | number;
  "New"?: string | number;
}

export interface AnalyzedProduct {
  id: string; // generated UUID or ASIN
  asin: string;
  title: string;
  imageUrl: string | null; // Added image URL
  ourPrice: number;
  buyBoxPrice: number;
  buyBoxSeller: string;
  status: BuyBoxStatus;
  delta: number; // ourPrice - buyBoxPrice
  action: string;
}

export interface SummaryStats {
  total: number;
  won: number;
  lost: number;
  suppressed: number;
  winRate: number;
}