import { BuyBoxStatus, AnalyzedProduct, RawKeepaRow } from '../types';

/**
 * Normalizes price strings to numbers.
 * Handles "$5.00", "5.00", and empty strings.
 */
const parsePrice = (val: string | number | boolean | null | undefined): number => {
  if (typeof val === 'number') return val;
  if (typeof val !== 'string' || !val || val === '-') return 0;
  const clean = val.replace(/[^0-9.]/g, '');
  return parseFloat(clean) || 0;
};

/**
 * Normalizes Keepa boolean-like values (yes/no, 1/0, true/false)
 */
const normalizeBool = (val: string | number | boolean | null | undefined): boolean => {
  if (typeof val === 'boolean') return val;
  if (typeof val === 'string') {
    const lower = val.toLowerCase().trim();
    return lower === 'yes' || lower === 'true' || lower === '1';
  }
  if (typeof val === 'number') return val === 1;
  return false;
};

/**
 * Safely extracts a value from a row using multiple possible keys (resilience)
 */
const getSafeValue = (row: RawKeepaRow, keys: string[]): string | number | undefined => {
  const rowKeys = Object.keys(row);
  for (const searchKey of keys) {
    // 1. Try exact match
    if (row[searchKey] !== undefined && row[searchKey] !== null && row[searchKey] !== '-') {
      return row[searchKey];
    }
    // 2. Try case-insensitive and trimmed match (Keepa often adds trailing spaces)
    const normalizedSearch = searchKey.trim().toLowerCase();
    const actualKey = rowKeys.find(k => k.trim().toLowerCase() === normalizedSearch);
    
    if (actualKey && row[actualKey] !== undefined && row[actualKey] !== null && row[actualKey] !== '-') {
      return row[actualKey];
    }
  }
  return undefined;
};

export const mapKeepaRow = (row: RawKeepaRow) => {
  const buyBoxPrice = parsePrice(getSafeValue(row, ["Buy Box: Current", "Buy Box 🚚: Current", "Buy Box Price", "Buy Box Winner: Price"]));
  const sellerRaw = getSafeValue(row, ["Buy Box: Buy Box Seller", "Buy Box Seller", "Buy Box: Seller", "Buy Box Winner"]);
  
  return {
    asin: String(getSafeValue(row, ["ASIN", "asin"]) || "UNKNOWN"),
    title: String(getSafeValue(row, ["Title", "title"]) || "Unknown Product"),
    buyBoxPrice,
    buyBoxSeller: sellerRaw ? String(sellerRaw).trim() : "-",
    ourPrice: parsePrice(getSafeValue(row, ["New: Current", "New", "Amazon", "Merchant Price"])),
    isSuppressed: buyBoxPrice === 0 || !sellerRaw || sellerRaw === '-',
    prime: normalizeBool(getSafeValue(row, ["Buy Box: Prime Eligible", "Buy Box: Prime exclusive"]))
  };
};

/**
 * The Brain: Determines if we won based on Seller Name.
 * Checks if the buyBoxSeller string matches the target identity.
 * 
 * @param buyBoxSeller - The seller name from the CSV
 * @param buyBoxPrice - The price from the CSV
 * @param targetIdentity - 'ALL' or a specific brand name (e.g., 'Jolt Inc.')
 * @param identities - List of seller names that belong to "Us"
 */
export const determineStatus = (
  buyBoxSeller: string, 
  buyBoxPrice: number, 
  targetIdentity: string = 'ALL',
  identities: string[] = []
): BuyBoxStatus => {
  if (buyBoxPrice === 0 || !buyBoxSeller || buyBoxSeller === '-') {
    return BuyBoxStatus.SUPPRESSED;
  }

  const sellerLower = buyBoxSeller.toLowerCase().trim();
  let isUs = false;

  if (targetIdentity === 'ALL') {
    // Check if the seller string includes ANY of our brand names
    isUs = identities.some(name => name && sellerLower.includes(name.toLowerCase().trim()));
  } else {
    // Check specific brand identity
    isUs = sellerLower.includes(targetIdentity.toLowerCase().trim());
  }

  return isUs ? BuyBoxStatus.WON : BuyBoxStatus.LOST;
};

/**
 * Maps raw CSV row to our internal clean structure.
 */
export const analyzeRow = (
  row: RawKeepaRow, 
  targetIdentity: string = 'ALL', 
  identities: string[] = []
): AnalyzedProduct | null => {
  const mapped = mapKeepaRow(row);
  
  if (mapped.asin === 'UNKNOWN') return null;

  // Extract Image (handled separately due to specific split logic)
  const imageRaw = row['Image'] || row['image'] || '';
  const imageUrl = imageRaw ? imageRaw.toString().split(';')[0].trim() : null;
  
  const status = mapped.isSuppressed 
    ? BuyBoxStatus.SUPPRESSED 
    : determineStatus(mapped.buyBoxSeller, mapped.buyBoxPrice, targetIdentity, identities);
    
  const delta = mapped.ourPrice - mapped.buyBoxPrice;

  // 7. Action Recommendation Logic
  let action = '';

  if (status === BuyBoxStatus.SUPPRESSED) {
      action = "Fix Listing / Add Price";
  } else if (status === BuyBoxStatus.WON) {
      // If we WON, delta is usually 0. 
      // If delta is negative (ourPrice < buyBoxPrice), we are undercutting the recorded BB price.
      if (delta <= -1.0) {
          action = "Consider a slight price increase";
      } else {
          action = "Hold Price";
      }
  } else {
      // Status: LOST
      if (mapped.ourPrice === 0) {
          action = "Check Stock / Set Price";
      } else if (delta > 0) {
          // We are more expensive than the Buy Box
          if (delta > 3.0 || (mapped.buyBoxPrice > 0 && (delta / mapped.buyBoxPrice) > 0.15)) {
               // If price difference is > $3.00 or > 15%, suggest aggressive action
               action = "Aggressively reprice to capture Buy Box";
          } else {
               action = "Lower Price to Match";
          }
      } else {
          // We are cheaper (negative delta) or equal but LOST
          // Likely due to shipping time, FBA status, or account health
          action = "Check Eligibility / Metrics";
      }
  }

  return {
    id: mapped.asin + Math.random().toString(36).slice(2, 11),
    asin: mapped.asin,
    title: mapped.title,
    imageUrl,
    buyBoxSeller: mapped.buyBoxSeller,
    buyBoxPrice: mapped.buyBoxPrice,
    ourPrice: mapped.ourPrice,
    status,
    delta,
    action
  };
};