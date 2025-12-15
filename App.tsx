import React, { useState, useEffect } from 'react';
import ResultsTable from './components/ResultsTable';
import Summary from './components/Summary';
import HelpModal from './components/HelpModal';
import SettingsModal from './components/SettingsModal';
import Hero from './components/Hero';
import { RawKeepaRow } from './types';
import { APP_NAME, DEFAULT_SELLER_NAMES } from './constants';
import { useKeepaAnalysis } from './hooks/useKeepaAnalysis';
import { IconLogo, IconHelp, IconSettings } from './components/Icons';

const App: React.FC = () => {
  // State for raw data
  const [rawRows, setRawRows] = useState<RawKeepaRow[]>([]);
  
  // State for Brand Settings (Persisted)
  const [brands, setBrands] = useState<string[]>(() => {
    const saved = localStorage.getItem('buybox_master_brands');
    return saved ? JSON.parse(saved) : DEFAULT_SELLER_NAMES;
  });

  // Persist brands when changed
  useEffect(() => {
    localStorage.setItem('buybox_master_brands', JSON.stringify(brands));
  }, [brands]);

  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Pass dynamic brands list to hook
  const { analyzedData, stats } = useKeepaAnalysis(rawRows, selectedBrand, brands);

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
             <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-brand-500/30 overflow-hidden">
               <IconLogo className="w-5 h-5" />
             </div>
             <div>
               <h1 className="text-lg font-bold text-slate-900 tracking-tight">{APP_NAME}</h1>
             </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
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
                    {brands.length > 0 ? (
                      brands.map((name) => (
                        <option key={name} value={name}>{name}</option>
                      ))
                    ) : (
                      <option disabled>No brands configured</option>
                    )}
                  </select>
                </div>
            )}

            <button
                onClick={() => setIsSettingsOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-slate-600 bg-white border border-slate-200 hover:text-brand-600 hover:border-brand-200 hover:bg-brand-50 rounded-lg transition-all shadow-sm"
                title="Manage Brands"
            >
                <IconSettings className="w-5 h-5" />
                <span className="hidden sm:inline text-sm font-medium">Brands</span>
            </button>

            <button
                onClick={() => setIsHelpOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-slate-600 bg-white border border-slate-200 hover:text-brand-600 hover:border-brand-200 hover:bg-brand-50 rounded-lg transition-all shadow-sm"
                title="Open Help Center"
            >
                <IconHelp className="w-5 h-5" />
                <span className="hidden sm:inline text-sm font-medium">Help</span>
            </button>

            {rawRows.length > 0 && (
              <button
                onClick={handleReset}
                className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors ml-2"
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
            <Hero onDataLoaded={handleDataLoaded} />
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
         <p>© {new Date().getFullYear()} {APP_NAME}. Built for Amazon Sellers.</p>
      </footer>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        brands={brands}
        setBrands={setBrands}
      />
    </div>
  );
};

export default App;