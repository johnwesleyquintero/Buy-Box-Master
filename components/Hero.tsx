import React from 'react';
import FileUpload from './FileUpload';
import { RawKeepaRow } from '../types';
import { APP_VERSION } from '../constants';
import { IconAnalysis, IconCompetitor, IconPrivacy } from './Icons';

interface HeroProps {
  onDataLoaded: (data: RawKeepaRow[]) => void;
}

const Hero: React.FC<HeroProps> = ({ onDataLoaded }) => {
  return (
    <div className="animate-fade-in-up max-w-4xl mx-auto text-center pb-12">
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
        The strategic intelligence tool to instantly analyze CSV exports, detect win rates, spot suppression, and optimize pricing strategy.
      </p>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 text-left max-w-3xl mx-auto">
        <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/50 shadow-sm flex items-start gap-3">
           <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <IconAnalysis className="w-5 h-5" />
           </div>
           <div>
              <h3 className="font-semibold text-slate-900 text-sm">Instant Analysis</h3>
              <p className="text-xs text-slate-500 mt-1">Parses thousands of rows in milliseconds.</p>
           </div>
        </div>
        <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/50 shadow-sm flex items-start gap-3">
           <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <IconCompetitor className="w-5 h-5" />
           </div>
           <div>
              <h3 className="font-semibold text-slate-900 text-sm">Competitor Recon</h3>
              <p className="text-xs text-slate-500 mt-1">See exactly who is impacting your sales.</p>
           </div>
        </div>
        <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/50 shadow-sm flex items-start gap-3">
           <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <IconPrivacy className="w-5 h-5" />
           </div>
           <div>
              <h3 className="font-semibold text-slate-900 text-sm">Privacy First</h3>
              <p className="text-xs text-slate-500 mt-1">Data processes locally. Nothing uploads.</p>
           </div>
        </div>
      </div>

      <FileUpload onDataLoaded={onDataLoaded} />
      
      <p className="mt-6 text-xs text-slate-400 font-medium tracking-wide mb-12">
        Trusted CSV Data Processor Tool
      </p>

      {/* Education Section */}
      <div className="max-w-2xl mx-auto border-t border-slate-200/60 pt-10">
        <div className="flex flex-col items-center">
            <span className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded mb-4">
                Ecosystem Education
            </span>
            <h3 className="text-slate-900 font-semibold mb-3">
                Need Real-Time Monitoring?
            </h3>
            <p className="text-sm text-slate-500 mb-8 max-w-lg mx-auto leading-relaxed">
                This tool is designed for <strong>batch analysis</strong> of exported data. For continuous, 24/7 monitoring of Buy Box ownership, we recommend pairing your workflow with:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-blue-600 font-bold text-sm mb-1">Keepa</div>
                    <p className="text-xs text-slate-500">Essential for Buy Box history charts and detailed price tracking.</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-blue-600 font-bold text-sm mb-1">Helium 10</div>
                    <p className="text-xs text-slate-500">Powerful Xray tools and alerts for ownership changes.</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-blue-600 font-bold text-sm mb-1">AMZScout Pro</div>
                    <p className="text-xs text-slate-500">Lightweight extension for instant Buy Box visibility.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;