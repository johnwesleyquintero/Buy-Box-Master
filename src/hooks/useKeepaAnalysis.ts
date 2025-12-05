import { useMemo } from 'react';
import { RawKeepaRow, AnalyzedProduct, BuyBoxStatus, SummaryStats } from '../types';
import { analyzeRow } from '../utils/status';

interface UseKeepaAnalysisResult {
  analyzedData: AnalyzedProduct[];
  stats: SummaryStats;
}

export const useKeepaAnalysis = (
  rawRows: RawKeepaRow[], 
  selectedBrand: string
): UseKeepaAnalysisResult => {
  
  // 1. Transform Raw Rows to Analyzed Products
  const analyzedData: AnalyzedProduct[] = useMemo(() => {
    return rawRows
      .map(row => analyzeRow(row, selectedBrand))
      .filter((item): item is AnalyzedProduct => item !== null);
  }, [rawRows, selectedBrand]);

  // 2. Calculate Real-time Statistics
  const stats: SummaryStats = useMemo(() => {
    const total = analyzedData.length;
    const won = analyzedData.filter(p => p.status === BuyBoxStatus.WON).length;
    const lost = analyzedData.filter(p => p.status === BuyBoxStatus.LOST).length;
    const suppressed = analyzedData.filter(p => p.status === BuyBoxStatus.SUPPRESSED).length;
    
    // Protect against division by zero
    const winRate = total > 0 ? (won / total) * 100 : 0;

    return { total, won, lost, suppressed, winRate };
  }, [analyzedData]);

  return { analyzedData, stats };
};