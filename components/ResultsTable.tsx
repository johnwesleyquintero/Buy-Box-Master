import React from 'react';
import { AnalyzedProduct, BuyBoxStatus } from '../types';

interface ResultsTableProps {
  products: AnalyzedProduct[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ products }) => {
  
  // Basic helper to color code the delta
  const getDeltaColor = (delta: number) => {
    if (delta > 0) return 'text-red-600'; // We are more expensive
    if (delta < 0) return 'text-green-600'; // We are cheaper
    return 'text-slate-400'; // Equal
  };

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

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-6 py-3 font-semibold">ASIN / Product</th>
              <th scope="col" className="px-6 py-3 font-semibold">Status</th>
              <th scope="col" className="px-6 py-3 font-semibold text-right">Our Price</th>
              <th scope="col" className="px-6 py-3 font-semibold text-right">BB Price</th>
              <th scope="col" className="px-6 py-3 font-semibold text-right">Delta</th>
              <th scope="col" className="px-6 py-3 font-semibold">Current Winner</th>
              <th scope="col" className="px-6 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{product.asin}</div>
                  <div className="text-xs text-slate-500 truncate max-w-[200px]" title={product.title}>
                    {product.title}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(product.status)}
                </td>
                <td className="px-6 py-4 text-right font-medium text-slate-700">
                  {product.ourPrice > 0 ? `$${product.ourPrice.toFixed(2)}` : 'N/A'}
                </td>
                <td className="px-6 py-4 text-right font-medium text-slate-900">
                  {product.buyBoxPrice > 0 ? `$${product.buyBoxPrice.toFixed(2)}` : '-'}
                </td>
                <td className={`px-6 py-4 text-right font-mono text-xs ${getDeltaColor(product.delta)}`}>
                   {product.delta > 0 ? '+' : ''}{product.delta.toFixed(2)}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;