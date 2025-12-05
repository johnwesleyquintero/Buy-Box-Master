import React, { useState, useMemo } from 'react';
import FileUpload from './components/FileUpload';
import ResultsTable from './components/ResultsTable';
import Summary from './components/Summary';
import { RawKeepaRow, AnalyzedProduct, BuyBoxStatus, SummaryStats } from './types';
import { analyzeRow } from './utils/status';
import { APP_NAME, APP_VERSION, OUR_SELLER_NAMES } from './constants';

const App: React.FC = () => {
  const [analyzedData, setAnalyzedData] = useState<AnalyzedProduct[]>([]);

  // Derived state for summary statistics
  const stats: SummaryStats = useMemo(() => {
    const total = analyzedData.length;
    const won = analyzedData.filter(p => p.status === BuyBoxStatus.WON).length;
    const lost = analyzedData.filter(p => p.status === BuyBoxStatus.LOST).length;
    const suppressed = analyzedData.filter(p => p.status === BuyBoxStatus.SUPPRESSED).length;
    const winRate = total > 0 ? (won / total) * 100 : 0;

    return { total, won, lost, suppressed, winRate };
  }, [analyzedData]);

  const handleDataLoaded = (rawData: RawKeepaRow[]) => {
    const processed = rawData
      .map(analyzeRow)
      .filter((item): item is AnalyzedProduct => item !== null);
    
    setAnalyzedData(processed);
  };

  const handleReset = () => {
    setAnalyzedData([]);
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Navbar */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-blue-200 shadow-md">
               B
             </div>
             <div>
               <h1 className="text-lg font-bold text-slate-900 leading-tight">{APP_NAME}</h1>
               <p className="text-xs text-slate-500 font-mono">{APP_VERSION}</p>
             </div>
          </div>
          
          {analyzedData.length > 0 && (
            <button
              onClick={handleReset}
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
            >
              Start Over
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {analyzedData.length === 0 ? (
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
                  Checking for: <span className="font-mono text-slate-700">{OUR_SELLER_NAMES.join(', ')}</span>
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