import React, { useCallback, useState } from 'react';
import Papa from 'papaparse';
import { RawKeepaRow } from '../types';
import { IconUpload } from './Icons';

interface FileUploadProps {
  onDataLoaded: (data: RawKeepaRow[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const processFile = (file: File) => {
    setError(null);
    setLoading(true);

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file.');
      setLoading(false);
      return;
    }

    Papa.parse<RawKeepaRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          onDataLoaded(results.data);
        } else {
          setError('CSV parsed but contained no rows.');
        }
        setLoading(false);
      },
      error: (err: Error) => {
        setError(`Error parsing CSV: ${err.message}`);
        setLoading(false);
      }
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative group">
      {/* Decorative Blur Background for Glow Effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r from-brand-400 to-indigo-400 rounded-2xl blur opacity-20 group-hover:opacity-60 transition duration-500 ${isDragging ? 'opacity-100' : ''}`}></div>
      
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative bg-white rounded-xl p-12 text-center transition-all duration-300 ease-out border
          ${isDragging 
            ? 'border-brand-500 scale-[1.02] shadow-2xl' 
            : 'border-slate-200 shadow-xl group-hover:border-brand-300'
          }
        `}
      >
        <div className="space-y-6">
          <div className={`mx-auto h-20 w-20 rounded-full flex items-center justify-center transition-colors duration-300 ${isDragging ? 'bg-brand-100 text-brand-600' : 'bg-slate-50 text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-500'}`}>
             <IconUpload className="w-10 h-10" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              {loading ? 'Crunching Numbers...' : 'Upload Keepa Export'}
            </h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              Drag and drop your <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-slate-600">.csv</span> file here, or click to browse files from your computer.
            </p>
          </div>

          <button className={`
            px-6 py-2.5 rounded-lg text-sm font-semibold shadow-sm ring-1 ring-inset
            ${loading ? 'bg-slate-100 text-slate-400 ring-slate-200 cursor-not-allowed' : 'bg-white text-slate-900 ring-slate-300 hover:bg-slate-50'}
          `}>
             Select File manually
          </button>

          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={loading}
          />
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm font-medium text-center shadow-sm animate-fade-in">
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;