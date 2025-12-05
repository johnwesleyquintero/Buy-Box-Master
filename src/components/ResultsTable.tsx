import React, { useState, useMemo } from 'react';
import { AnalyzedProduct, BuyBoxStatus } from '../types';

interface ResultsTableProps {
  products: AnalyzedProduct[];
}

type SortKey = keyof AnalyzedProduct;
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ products }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [filterText, setFilterText] = useState('');
  const [statusFilter, setStatusFilter] = useState<BuyBoxStatus | 'ALL'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Handle Copy ASIN
  const handleCopyAsin = (asin: string, id: string) => {
    navigator.clipboard.writeText(asin);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Handle Sort Request
  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

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

  // Helper for rendering badges
  const getStatusBadge = (status: BuyBoxStatus) => {
    switch (status) {
      case BuyBoxStatus.WON:
        return (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            WON
          </span>
        );
      case BuyBoxStatus.LOST:
        return (
          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
            LOST
          </span>
        );
      case BuyBoxStatus.SUPPRESSED:
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
            SUPPRESSED
          </span>
        );
      default:
        return null;
    }
  };

  // Helper for Delta Badge
  const getDeltaBadge = (delta: number) => {
    if (delta > 0) {
      // We are more expensive (Bad)
      return (
        <span className="inline-flex items-center rounded bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
          +{delta.toFixed(2)}
        </span>
      );
    }
    if (delta < 0) {
      // We are cheaper (Good)
      return (
        <span className="inline-flex items-center rounded bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
          {delta.toFixed(2)}
        </span>
      );
    }
    // Equal
    return <span className="text-slate-400 font-mono text-xs">-</span>;
  };

  // Helper for Header Cell with Sort
  const HeaderCell = ({ label, sortKey, align = 'left', title }: { label: string; sortKey: SortKey; align?: 'left' | 'right', title?: string }) => {
    const isActive = sortConfig?.key === sortKey;
    const direction = sortConfig?.direction;

    return (
      <th
        scope="col"
        onClick={() => requestSort(sortKey)}
        title={title}
        className={`sticky top-0 z-10 bg-slate-50 px-6 py-3 font-semibold cursor-pointer select-none group border-b border-slate-200 shadow-sm ${align === 'right' ? 'text-right' : 'text-left'}`}
      >
        <div className={`flex items-center gap-1 ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
          {label}
          <span className={`flex-none rounded text-slate-400 transition-all ${isActive ? 'bg-slate-200 text-blue-600 opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
             {isActive && direction === 'desc' ? (
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                 <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
               </svg>
             ) : (
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                 <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
               </svg>
             )}
          </span>
        </div>
      </th>
    );
  };

  return (
    <div className="space-y-4">
      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-96">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-400">
               <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
             </svg>
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-0 py-1.5 pl-10 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            placeholder="Search ASIN or Title..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
        
        <div className="w-full sm:w-auto">
          <select
            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as BuyBoxStatus | 'ALL')}
          >
            <option value="ALL">All Statuses</option>
            <option value={BuyBoxStatus.WON}>Won</option>
            <option value={BuyBoxStatus.LOST}>Lost</option>
            <option value={BuyBoxStatus.SUPPRESSED}>Suppressed</option>
          </select>
        </div>
      </div>

      {/* Table Container - Constrained Height + Scroll */}
      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col h-[600px]">
        <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
          <table className="min-w-full text-left text-sm whitespace-nowrap border-separate border-spacing-0">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <HeaderCell label="ASIN / Product" sortKey="title" />
                <HeaderCell label="Status" sortKey="status" />
                <HeaderCell label="Our Price" sortKey="ourPrice" align="right" />
                <HeaderCell label="BB Price" sortKey="buyBoxPrice" align="right" />
                <HeaderCell label="Delta" sortKey="delta" align="right" title="Our Price - BB Price (Red = More Expensive)" />
                <HeaderCell label="Current Winner" sortKey="buyBoxSeller" />
                <HeaderCell label="Action" sortKey="action" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processedProducts.length > 0 ? (
                processedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      {/* ASIN Copy Interaction */}
                      <div 
                        className="flex items-center gap-2 font-medium text-slate-900 cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => handleCopyAsin(product.asin, product.id)}
                        title="Click to copy ASIN"
                      >
                        {product.asin}
                        <span className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                          {copiedId === product.id ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-500">
                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                              <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
                              <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
                            </svg>
                          )}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 truncate max-w-[200px]" title={product.title}>
                        {product.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(product.status)}</td>
                    <td className="px-6 py-4 text-right font-medium text-slate-700">
                      {product.ourPrice > 0 ? `$${product.ourPrice.toFixed(2)}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-900">
                      {product.buyBoxPrice > 0 ? `$${product.buyBoxPrice.toFixed(2)}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {getDeltaBadge(product.delta)}
                    </td>
                    <td className="px-6 py-4 text-slate-600 max-w-[150px] truncate" title={product.buyBoxSeller}>
                      {product.buyBoxSeller || 'Unknown'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs ${product.status === BuyBoxStatus.WON ? 'text-slate-400' : 'text-blue-600 font-medium'}`}>
                        {product.action}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2 text-slate-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                      <p>No results found for your filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Simple Footer/Status Bar for Table context */}
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-500 flex justify-between">
           <span>Showing {processedProducts.length} results</span>
           <span>Scroll for more ↓</span>
        </div>
      </div>
    </div>
  );
};

export default ResultsTable;