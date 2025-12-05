import React, { useState, useMemo } from 'react';
import FileUpload from './components/FileUpload';
import ResultsTable from './components/ResultsTable';
import Summary from './components/Summary';
import { RawKeepaRow, AnalyzedProduct, BuyBoxStatus, SummaryStats } from './types';
import { analyzeRow } from './utils/status';
import { APP_NAME, APP_VERSION, OUR_SELLER_NAMES } from './constants';

const App: React.FC = () => {
  const [rawRows, setRawRows] = useState<RawKeepaRow[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');

  const analyzedData: AnalyzedProduct[] = useMemo(() => {
    return rawRows
      .map(row => analyzeRow(row, selectedBrand))
      .filter((item): item is AnalyzedProduct => item !== null);
  }, [rawRows, selectedBrand]);

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
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
      {/* Background Gradient Orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-pulse-slow"></div>
        <div className="absolute top-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-400/20 rounded-full blur-[100px] mix-blend-multiply opacity-70"></div>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/20 glass-panel shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
             <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-brand-500/30">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436h.008c.64.459 1.51.271 2.379.271.868 0 1.739.188 2.379-.271V15a.75.75 0 01-.75.75c-2.446 0-4.633.935-6.28 2.455-.44.405-1.13.405-1.57 0a8.966 8.966 0 01-2.455-6.28.75.75 0 01.75-.75c.46 0 .648.869.272 2.38-.459.64-.271 1.51-.271 2.378 0 .869.188 1.74-.271 2.38H14.966z" clipRule="evenodd" />
                  <path d="M11.625 21.375a.75.75 0 01-.75.75 7.125 7.125 0 01-7.125-7.125.75.75 0 01.75-.75h.008c.64-.459 1.51-.271 2.379-.271.868 0 1.739.188 2.379.271V14.625c0 .621.504 1.125 1.125 1.125h.375v.375a1.125 1.125 0 001.125 1.125h.375c.46 0 .648.869.272 2.38-.459.64-.271 1.51-.271 2.378 0 .869.188 1.74-.271 2.38v.375z" />
               </svg>
             </div>
             <div>
               <h1 className="text-lg font-bold text-slate-900 tracking-tight">{APP_NAME}</h1>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             {rawRows.length > 0 && (
                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/50 rounded-lg border border-slate-200/60 shadow-inner">
                  <label htmlFor="brand-select" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Identity
                  </label>
                  <select
                    id="brand-select"
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="bg-transparent text-sm font-semibold text-slate-700 border-none focus:ring-0 p-0 cursor-pointer"
                  >
                    <option value="ALL">All Brands</option>
                    <option disabled>──────────</option>
                    {OUR_SELLER_NAMES.map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
            )}

            {rawRows.length > 0 && (
              <button
                onClick={handleReset}
                className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {rawRows.length === 0 ? (
            <div className="animate-fade-in-up max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800 mb-8 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
                {APP_VERSION} Live — Optimized for Keepa Exports
              </div>

              {/* Hero Type */}
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600">
                Dominate the Buy Box.
              </h2>
              <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                The internal intelligence tool for <span className="font-semibold text-slate-900">Speedtalk, SecuLife, EmojiKidz</span> & <span className="font-semibold text-slate-900">Jolt</span>. 
                Instantly analyze CSV exports to detect win rates, spot suppression, and optimize pricing strategy.
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 text-left max-w-3xl mx-auto">
                <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/50 shadow-sm flex items-start gap-3">
                   <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                      </svg>
                   </div>
                   <div>
                      <h3 className="font-semibold text-slate-900 text-sm">Instant Analysis</h3>
                      <p className="text-xs text-slate-500 mt-1">Parses thousands of rows in milliseconds.</p>
                   </div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/50 shadow-sm flex items-start gap-3">
                   <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                      </svg>
                   </div>
                   <div>
                      <h3 className="font-semibold text-slate-900 text-sm">Competitor Recon</h3>
                      <p className="text-xs text-slate-500 mt-1">See exactly who is stealing your sales.</p>
                   </div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/50 shadow-sm flex items-start gap-3">
                   <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                      </svg>
                   </div>
                   <div>
                      <h3 className="font-semibold text-slate-900 text-sm">Privacy First</h3>
                      <p className="text-xs text-slate-500 mt-1">Data processes locally. Nothing uploads.</p>
                   </div>
                </div>
              </div>

              <FileUpload onDataLoaded={handleDataLoaded} />
              
              <p className="mt-8 text-xs text-slate-400 font-medium tracking-wide">
                TRUSTED BY OPERATIONS TEAMS AT SPEEDTALK, EMOJIKIDZ, JOLT & SECULIFE
              </p>
            </div>
          ) : (
            <div className="animate-fade-in space-y-8">
               {/* Dashboard Header */}
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Performance Report</h2>
                    <p className="text-slate-500 mt-1">Real-time analysis based on {rawRows.length} ASINs.</p>
                  </div>
                  <div className="text-right hidden md:block">
                     <div className="text-sm font-medium text-slate-500">Target Identity</div>
                     <div className="text-xl font-bold text-brand-600 bg-brand-50 px-3 py-0.5 rounded-lg inline-block border border-brand-100">
                        {selectedBrand === 'ALL' ? 'All Brands' : selectedBrand}
                     </div>
                  </div>
               </div>
               
               <Summary stats={stats} />
               
               <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
                 <div className="px-6 py-5 border-b border-slate-200/60 flex items-center justify-between">
                   <h3 className="font-bold text-slate-900">Line Item Details</h3>
                 </div>
                 <ResultsTable products={analyzedData} />
               </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-auto py-8 text-center text-slate-400 text-sm">
         <p>© {new Date().getFullYear()} {APP_NAME}. Internal Tool.</p>
      </footer>
    </div>
  );
};

export default App;