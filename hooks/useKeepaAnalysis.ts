import { useMemo } from 'react';
import { RawKeepaRow, AnalyzedProduct, BuyBoxStatus, SummaryStats } from '../types';
import { analyzeRow } from '../utils/status';

interface UseKeepaAnalysisResult {
  analyzedData: AnalyzedProduct[];
  stats: SummaryStats;
}

export const useKeepaAnalysis = (
  rawRows: RawKeepaRow[], 
  selectedBrand: string,
  identities: string[] // Added dynamic identities list
): UseKeepaAnalysisResult => {
  
  // 1. Transform Raw Rows to Analyzed Products
  const analyzedData: AnalyzedProduct[] = useMemo(() => {
    return rawRows
      .map(row => analyzeRow(row, selectedBrand, identities))
      .filter((item): item is AnalyzedProduct => item !== null);
  }, [rawRows, selectedBrand, identities]); // Re-run if identities change

  // 2. Calculate Real-time Statistics
  const stats: SummaryStats = useMemo(() => {
    const total = analyzedData.length;
    const wonItems = analyzedData.filter(p => p.status === BuyBoxStatus.WON);
    const lostItems = analyzedData.filter(p => p.status === BuyBoxStatus.LOST);
    const suppressedItems = analyzedData.filter(p => p.status === BuyBoxStatus.SUPPRESSED);
    
    const won = wonItems.length;
    const lost = lostItems.length;
    const suppressed = suppressedItems.length;
    
    // Protect against division by zero
    const winRate = total > 0 ? (won / total) * 100 : 0;

    // Calculate Average Delta for LOST items (How far off are we usually?)
    // We only care about positive deltas (where we are more expensive) for this metric usually,
    // but a general average of the gap helps.
    let totalGap = 0;
    let gapCount = 0;
    
    lostItems.forEach(item => {
        if (item.delta > 0) {
            totalGap += item.delta;
            gapCount++;
        }
    });

    const avgDelta = gapCount > 0 ? totalGap / gapCount : 0;

    return { total, won, lost, suppressed, winRate, avgDelta };
  }, [analyzedData]);

  return { analyzedData, stats };
};