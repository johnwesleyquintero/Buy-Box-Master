import { useState, useMemo } from 'react';
import { AnalyzedProduct, BuyBoxStatus } from '../types';

export type SortKey = keyof AnalyzedProduct;
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

export const useProductTable = (products: AnalyzedProduct[]) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [filterText, setFilterText] = useState('');
  const [statusFilter, setStatusFilter] = useState<BuyBoxStatus | 'ALL'>('ALL');

  // Process Data: Filter -> Sort
  const processedProducts = useMemo(() => {
    let data = [...products];

    // 1. Filter by Status
    if (statusFilter !== 'ALL') {
      data = data.filter((p) => p.status === statusFilter);
    }

    // 2. Filter by Text (ASIN or Title)
    if (filterText) {
      const lower = filterText.toLowerCase();
      data = data.filter(
        (p) =>
          p.asin.toLowerCase().includes(lower) ||
          p.title.toLowerCase().includes(lower)
      );
    }

    // 3. Sort
    if (sortConfig) {
      data.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];

        if (valA! < valB!) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA! > valB!) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [products, sortConfig, filterText, statusFilter]);

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return {
    processedProducts,
    sortConfig,
    requestSort,
    filterText,
    setFilterText,
    statusFilter,
    setStatusFilter
  };
};
