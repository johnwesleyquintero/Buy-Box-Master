import React from 'react';
import { BuyBoxStatus } from '../types';
import { IconSearch } from './Icons';

interface TableToolbarProps {
  filterText: string;
  setFilterText: (text: string) => void;
  statusFilter: BuyBoxStatus | 'ALL';
  setStatusFilter: (status: BuyBoxStatus | 'ALL') => void;
}

const TableToolbar: React.FC<TableToolbarProps> = ({ 
  filterText, 
  setFilterText, 
  statusFilter, 
  setStatusFilter 
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <div className="relative w-full sm:w-96">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
           <IconSearch className="w-5 h-5 text-slate-400" />
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
  );
};

export default TableToolbar;
