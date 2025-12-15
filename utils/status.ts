import { BuyBoxStatus, AnalyzedProduct, RawKeepaRow } from '../types';
import { SUGGESTED_ACTIONS } from '../constants';

/**
 * Normalizes price strings to numbers.
 * Handles "$5.00", "5.00", and empty strings.
 */
const parsePrice = (val: string | number | undefined): number => {
  if (typeof val === 'number') return val;
  if (!val || val === '-') return 0; // Keepa uses '-' for empty sometimes
  const clean = val.replace(/[^0-9.]/g, '');
  return parseFloat(clean) || 0;
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
  if (!buyBoxPrice || buyBoxPrice === 0) {
    return BuyBoxStatus.SUPPRESSED;
  }

  const sellerLower = buyBoxSeller.toLowerCase();
  let isUs = false;

  if (targetIdentity === 'ALL') {
    // Check if the seller string includes ANY of our brand names
    isUs = identities.some(name => sellerLower.includes(name.toLowerCase()));
  } else {
    // Check specific brand identity
    isUs = sellerLower.includes(targetIdentity.toLowerCase());
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
  // 1. Extract ASIN
  const asin = (row.ASIN || row.asin || 'UNKNOWN').toString();
  if (!asin || asin === 'UNKNOWN') return null;

  // 2. Extract Title
  const title = (row.Title || row.title || 'Unknown Product').toString();

  // 3. Extract Image
  const imageRaw = row['Image'] || row['image'] || '';
  const imageUrl = imageRaw ? imageRaw.toString().split(';')[0].trim() : null;
  
  // 4. Extract Seller
  const bbSellerRaw = (
    row['Buy Box: Buy Box Seller'] || 
    row['Buy Box Seller'] || 
    row.buyBoxSellerName || 
    row['Buy Box SellerId'] || 
    '-'
  ).toString();
  
  // 5. Extract Prices
  const bbPriceRaw = row['Buy Box 🚚: Current'] || row['Buy Box Price'] || row.buyBoxPrice;
  const ourPriceRaw = row['New: Current'] || row['New'] || row['Amazon'] || 0;

  const buyBoxPrice = parsePrice(bbPriceRaw);
  const ourPrice = parsePrice(ourPriceRaw);

  // 6. Logic - Pass identities down
  const status = determineStatus(bbSellerRaw, buyBoxPrice, targetIdentity, identities);
  const delta = ourPrice - buyBoxPrice;

  // 7. Action Recommendation
  let action = '';
  switch (status) {
    case BuyBoxStatus.WON:
      action = SUGGESTED_ACTIONS.WON;
      break;
    case BuyBoxStatus.SUPPRESSED:
      action = SUGGESTED_ACTIONS.SUPPRESSED;
      break;
    case BuyBoxStatus.LOST:
      action = SUGGESTED_ACTIONS.LOST;
      break;
  }

  return {
    id: asin + Math.random().toString(36).substr(2, 9),
    asin,
    title,
    imageUrl,
    buyBoxSeller: bbSellerRaw,
    buyBoxPrice,
    ourPrice,
    status,
    delta,
    action
  };
};