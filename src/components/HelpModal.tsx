import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="p-1.5 bg-brand-100 text-brand-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </span>
            Operator's Manual
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-8">
            
            {/* Section 1: Workflow */}
            <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">1. The Workflow</h4>
                <ol className="list-decimal list-inside space-y-2 text-slate-600 text-sm">
                    <li>Export your data from Keepa as a <strong>CSV</strong> file.</li>
                    <li>Drag & Drop the file into the dashboard area.</li>
                    <li>The system instantly matches the "Buy Box Seller" against our known aliases (SecuLife, SpeedTalk, etc.).</li>
                </ol>
            </div>

            {/* Section 2: Legend */}
            <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">2. Status Legend</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-3 rounded-xl bg-green-50 border border-green-100">
                        <span className="text-xs font-bold text-green-700 block mb-1">✅ WON</span>
                        <p className="text-xs text-green-800/80 leading-relaxed">
                            We currently hold the Buy Box. Recommendation: <strong>Hold Price</strong>.
                        </p>
                    </div>
                    <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                        <span className="text-xs font-bold text-red-700 block mb-1">❌ LOST</span>
                        <p className="text-xs text-red-800/80 leading-relaxed">
                            A competitor (or Amazon) holds the Buy Box. Check the <strong>Delta</strong>.
                        </p>
                    </div>
                    <div className="p-3 rounded-xl bg-yellow-50 border border-yellow-100">
                        <span className="text-xs font-bold text-yellow-700 block mb-1">⚠️ SUPPRESSED</span>
                        <p className="text-xs text-yellow-800/80 leading-relaxed">
                            No Buy Box price found. Listing might be broken or price is too high.
                        </p>
                    </div>
                </div>
            </div>

            {/* Section 3: Delta */}
            <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">3. Understanding "Delta"</h4>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-sm text-slate-600 space-y-2">
                    <p>Delta represents the gap between <strong>Our Price</strong> and the <strong>Buy Box Price</strong>.</p>
                    <ul className="space-y-1 ml-4">
                        <li className="flex items-center gap-2">
                            <span className="inline-flex items-center rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">+$5.00</span>
                            <span>= We are <strong>$5.00 more expensive</strong> than the winner.</span>
                        </li>
                        <li className="flex items-center gap-2">
                             <span className="inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">-$2.00</span>
                            <span>= We are <strong>$2.00 cheaper</strong> than the winner.</span>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
        
        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
            <button 
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors"
            >
                Got it, let's work
            </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;