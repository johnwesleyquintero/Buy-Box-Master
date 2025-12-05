import React, { useCallback, useState } from 'react';
import Papa from 'papaparse';
import { RawKeepaRow } from '../types';

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
    <div className="w-full max-w-2xl mx-auto mt-10">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ease-in-out
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white hover:border-slate-400'}
        `}
      >
        <div className="space-y-4">
          <div className="mx-auto h-16 w-16 text-slate-400">
             {/* Simple CSV Icon SVG */}
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          
          <h3 className="text-xl font-semibold text-slate-900">
            {loading ? 'Parsing Keepa File...' : 'Upload Keepa Export'}
          </h3>
          
          <p className="text-slate-500">
            Drag and drop your CSV here, or click to browse.
          </p>

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
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm text-center">
          {error}
        </div>
      )}

      <div className="mt-8 text-center text-xs text-slate-400">
        Compatible with Standard Keepa Data Exports • Auto-detection of Buy Box Columns
      </div>
    </div>
  );
};

export default FileUpload;