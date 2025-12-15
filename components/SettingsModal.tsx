import React, { useState } from 'react';
import { IconTrash, IconPlus } from './Icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  brands: string[];
  setBrands: (brands: string[]) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, brands, setBrands }) => {
  const [newBrand, setNewBrand] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBrand.trim() && !brands.includes(newBrand.trim())) {
      setBrands([...brands, newBrand.trim()]);
      setNewBrand('');
    }
  };

  const handleRemove = (brandToRemove: string) => {
    setBrands(brands.filter(b => b !== brandToRemove));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-fade-in" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-900">
            Brand Identities
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
        <div className="p-6">
            <p className="text-sm text-slate-500 mb-4">
              Add the exact seller names or brand aliases you use on Amazon. We use these to detect if you won the Buy Box.
            </p>

            {/* Add Form */}
            <form onSubmit={handleAdd} className="flex gap-2 mb-6">
                <input 
                    type="text" 
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    placeholder="e.g. MyStore Inc"
                    className="flex-1 rounded-lg border-slate-300 border px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                    autoFocus
                />
                <button 
                    type="submit"
                    disabled={!newBrand.trim()}
                    className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                    <IconPlus className="w-4 h-4" />
                    Add
                </button>
            </form>

            {/* List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                {brands.length === 0 && (
                    <div className="text-center py-6 text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-xl">
                        No brands configured. <br/> Add one to start tracking.
                    </div>
                )}
                {brands.map((brand) => (
                    <div key={brand} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg group hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-slate-200 transition-all">
                        <span className="font-medium text-slate-700 text-sm">{brand}</span>
                        <button 
                            onClick={() => handleRemove(brand)}
                            className="text-slate-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                            title="Remove Brand"
                        >
                            <IconTrash className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;