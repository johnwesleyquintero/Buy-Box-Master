import React, { useState } from 'react';
import { AnalyzedProduct, BuyBoxStatus } from '../types';
import { useProductTable, SortKey, SortConfig } from '../hooks/useProductTable';
import { IconSortAsc, IconSortDesc, IconImage, IconCheckCircle, IconCopy, IconNoResults } from './Icons';
import TableToolbar from './TableToolbar';
import { downloadCSV } from '../utils/export';

interface ResultsTableProps {
  products: AnalyzedProduct[];
}

// Extracted for performance (prevents recreation on render)
interface HeaderCellProps {
  label: string;
  sortKey: SortKey;
  align?: 'left' | 'right';
  title?: string;
  sortConfig: SortConfig | null;
  onRequestSort: (key: SortKey) => void;
}

const HeaderCell: React.FC<HeaderCellProps> = ({ label, sortKey, align = 'left', title, sortConfig, onRequestSort }) => {
  const isActive = sortConfig?.key === sortKey;
  const direction = sortConfig?.direction;

  return (
    <th
      scope="col"
      onClick={() => onRequestSort(sortKey)}
      title={title}
      className={`sticky top-0 z-10 bg-slate-50 px-6 py-3 font-semibold cursor-pointer select-none group border-b border-slate-200 shadow-sm ${align === 'right' ? 'text-right' : 'text-left'}`}
    >
      <div className={`flex items-center gap-1 ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
        {label}
        <span className={`flex-none rounded text-slate-400 transition-all ${isActive ? 'bg-slate-200 text-blue-600 opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
           {isActive && direction === 'desc' ? (
             <IconSortDesc className="w-4 h-4" />
           ) : (
             <IconSortAsc className="w-4 h-4" />
           )}
        </span>
      </div>
    </th>
  );
};

const ResultsTable: React.FC<ResultsTableProps> = ({ products }) => {
  const {
    processedProducts,
    sortConfig,
    requestSort,
    filterText,
    setFilterText,
    statusFilter,
    setStatusFilter
  } = useProductTable(products);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hoveredImage, setHoveredImage] = useState<{ src: string; top: number; left: number } | null>(null);

  const handleCopyAsin = (asin: string, id: string) => {
    navigator.clipboard.writeText(asin);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleDownload = () => {
    downloadCSV(processedProducts);
  };

  const handleMouseEnterImage = (e: React.MouseEvent<HTMLDivElement>, src: string | null) => {
    if (!src) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredImage({
      src,
      top: rect.top - 40,
      left: rect.right + 16,
    });
  };

  const handleMouseLeaveImage = () => {
    setHoveredImage(null);
  };

  const getStatusBadge = (status: BuyBoxStatus) => {
    switch (status) {
      case BuyBoxStatus.WON:
        return <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">WON</span>;
      case BuyBoxStatus.LOST:
        return <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">LOST</span>;
      case BuyBoxStatus.SUPPRESSED:
        return <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">SUPPRESSED</span>;
      default:
        return null;
    }
  };

  const getDeltaBadge = (delta: number) => {
    if (delta > 0) return <span className="inline-flex items-center rounded bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">+{delta.toFixed(2)}</span>;
    if (delta < 0) return <span className="inline-flex items-center rounded bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">{delta.toFixed(2)}</span>;
    return <span className="text-slate-400 font-mono text-xs">-</span>;
  };

  return (
    <div className="space-y-4">
      <TableToolbar 
        filterText={filterText}
        setFilterText={setFilterText}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onDownload={handleDownload}
      />

      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col h-[600px]">
        <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
          <table className="min-w-full text-left text-sm whitespace-nowrap border-separate border-spacing-0">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <HeaderCell label="ASIN / Product" sortKey="title" sortConfig={sortConfig} onRequestSort={requestSort} />
                <HeaderCell label="Status" sortKey="status" sortConfig={sortConfig} onRequestSort={requestSort} />
                <HeaderCell label="Our Price" sortKey="ourPrice" align="right" sortConfig={sortConfig} onRequestSort={requestSort} />
                <HeaderCell label="BB Price" sortKey="buyBoxPrice" align="right" sortConfig={sortConfig} onRequestSort={requestSort} />
                <HeaderCell label="Delta" sortKey="delta" align="right" title="Our Price - BB Price (Red = More Expensive)" sortConfig={sortConfig} onRequestSort={requestSort} />
                <HeaderCell label="Current Winner" sortKey="buyBoxSeller" sortConfig={sortConfig} onRequestSort={requestSort} />
                <HeaderCell label="Action" sortKey="action" sortConfig={sortConfig} onRequestSort={requestSort} />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processedProducts.length > 0 ? (
                processedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="relative shrink-0 cursor-zoom-in"
                          onMouseEnter={(e) => handleMouseEnterImage(e, product.imageUrl)}
                          onMouseLeave={handleMouseLeaveImage}
                        >
                          <div className="h-10 w-10 rounded bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                            {product.imageUrl ? (
                                <img src={product.imageUrl} alt="" className="h-full w-full object-contain" />
                            ) : (
                                <IconImage className="w-5 h-5 text-slate-300" />
                            )}
                          </div>
                        </div>

                        <div>
                          <div 
                            className="flex items-center gap-2 font-medium text-slate-900 cursor-pointer hover:text-blue-600 transition-colors"
                            onClick={() => handleCopyAsin(product.asin, product.id)}
                            title="Click to copy ASIN"
                          >
                            {product.asin}
                            <span className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                              {copiedId === product.id ? (
                                <IconCheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <IconCopy className="w-4 h-4" />
                              )}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 truncate max-w-[200px]" title={product.title}>
                            {product.title}
                          </div>
                        </div>
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
                      <IconNoResults className="w-8 h-8 mb-2 text-slate-300" />
                      <p>No results found for your filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-500 flex justify-between">
           <span>Showing {processedProducts.length} results</span>
           <span>Scroll for more ↓</span>
        </div>
      </div>

      {hoveredImage && (
        <div 
          className="fixed z-[9999] bg-white p-2 rounded-xl shadow-2xl border border-slate-200 pointer-events-none animate-fade-in"
          style={{ 
            top: `${hoveredImage.top}px`, 
            left: `${hoveredImage.left}px`,
            width: '240px'
          }}
        >
          <img src={hoveredImage.src} alt="Preview" className="w-full h-auto rounded-lg bg-slate-50" />
        </div>
      )}
    </div>
  );
};

export default ResultsTable;