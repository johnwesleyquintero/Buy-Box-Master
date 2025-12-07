import { AnalyzedProduct } from '../types';

/**
 * Converts a string to a CSV-safe string (escapes quotes, wraps in quotes if needed)
 */
const escapeCsv = (str: string | number | null | undefined): string => {
  if (str === null || str === undefined) return '';
  const stringValue = String(str);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

/**
 * Downloads the analyzed products as a CSV file.
 * Exports exactly what is passed in (so it respects current filters).
 */
export const downloadCSV = (data: AnalyzedProduct[]) => {
  if (!data || data.length === 0) {
    alert("No data to export.");
    return;
  }

  // Define Headers
  const headers = [
    "ASIN",
    "Title",
    "Status",
    "Our Price",
    "BB Price",
    "Delta",
    "Current Winner",
    "Recommended Action"
  ];

  // Map Data Rows
  const rows = data.map(product => [
    escapeCsv(product.asin),
    escapeCsv(product.title),
    escapeCsv(product.status),
    escapeCsv(product.ourPrice),
    escapeCsv(product.buyBoxPrice),
    escapeCsv(product.delta),
    escapeCsv(product.buyBoxSeller),
    escapeCsv(product.action)
  ]);

  // Combine Headers and Rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Create Blob and Trigger Download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  // Filename with timestamp
  const date = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `buybox-analysis-${date}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};