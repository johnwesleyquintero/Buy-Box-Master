import React, { useState, useMemo } from 'react';
import FileUpload from './components/FileUpload';
import ResultsTable from './components/ResultsTable';
import Summary from './components/Summary';
import { RawKeepaRow, AnalyzedProduct, BuyBoxStatus, SummaryStats } from './types';
import { analyzeRow } from './utils/status';
import { APP_NAME, APP_VERSION, OUR_SELLER_NAMES } from './constants';

const App: React.FC = () => {
  // Store raw rows so we can re-analyze when Brand changes
  const [rawRows, setRawRows] = useState<RawKeepaRow[]>([]);
  // Store the currently selected brand identity
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');

  // Derived state: processed data based on raw rows + selected brand
  const analyzedData: AnalyzedProduct[] = useMemo(() => {
    return rawRows
      .map(row => analyzeRow(row, selectedBrand))
      .filter((item): item is AnalyzedProduct => item !== null);
  }, [rawRows, selectedBrand]);

  // Derived state for summary statistics
  const stats: SummaryStats = useMemo(() => {
    const total = analyzedData.length;
    const won = analyzedData.filter(p => p.status === BuyBoxStatus.WON).length;
    const lost = analyzedData.filter(p => p.status === BuyBoxStatus.LOST).length;
    const suppressed = analyzedData.filter(p => p.status === BuyBoxStatus.SUPPRESSED).length;
    const winRate = total > 0 ? (won / total) * 100 : 0;

    return { total, won, lost, suppressed, winRate };
  }, [analyzedData]);

  const handleDataLoaded = (data: RawKeepaRow[]) => {
    setRawRows(data);
  };

  const handleReset = () => {
    setRawRows([]);
    setSelectedBrand('ALL');
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Navbar */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex flex-col sm:flex-row h-auto sm:h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-0 gap-3 sm:gap-0">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-blue-200 shadow-md">
               B
             </div>
             <div>
               <h1 className="text-lg font-bold text-slate-900 leading-tight">{APP_NAME}</h1>
               <p className="text-xs text-slate-500 font-mono">{APP_VERSION}</p>
             </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
            {/* Brand Selector Dropdown */}
            <div className="relative group">
              <div className="flex items-center gap-2">
                <label htmlFor="brand-select" className="text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:block">
                  Target Identity:
                </label>
                <select
                  id="brand-select"
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="block w-full sm:w-48 rounded-md border-0 py-1.5 pl-3 pr-8 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white shadow-sm cursor-pointer"
                >
                  <option value="ALL">All Brands</option>
                  <option disabled>──────────</option>
                  {OUR_SELLER_NAMES.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            </div>

            {rawRows.length > 0 && (
              <button
                onClick={handleReset}
                className="rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 whitespace-nowrap"
              >
                Start Over
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {rawRows.length === 0 ? (
          <div className="animate-fade-in-up">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Reclaim the Buy Box.
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Upload your Keepa CSV export to instantly analyze win rates and price gaps.
              </p>
            </div>
            <FileUpload onDataLoaded={handleDataLoaded} />
          </div>
        ) : (
          <div className="animate-fade-in">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Analysis Dashboard</h2>
                <div className="text-sm text-slate-500 text-right max-w-md">
                  Status for: <span className="font-mono text-slate-700 font-bold">{selectedBrand === 'ALL' ? 'All Brands' : selectedBrand}</span>
                </div>
             </div>
             
             <Summary stats={stats} />
             
             <div className="mb-4 flex items-center justify-between">
               <h3 className="text-lg font-semibold text-slate-900">Detailed Breakdown</h3>
             </div>
             
             <ResultsTable products={analyzedData} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;