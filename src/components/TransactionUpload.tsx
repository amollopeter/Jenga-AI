import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { Transaction } from '../types';
import { cn } from '../lib/utils';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker path for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface Props {
  onUpload: (data: Transaction[] | string) => void;
  isLoading: boolean;
}

export function TransactionUpload({ onUpload, isLoading }: Props) {
  const [isParsing, setIsParsing] = useState(false);

  const parseExcel = async (file: File) => {
    const reader = new FileReader();
    return new Promise<Transaction[]>((resolve, reject) => {
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
          
          // Heuristic to find headers and data
          // We expect columns like Date, Amount, Type, Description
          const transactions: Transaction[] = json.slice(1).map((row, index) => ({
            id: `xl-${index}`,
            date: String(row[0] || new Date().toISOString()),
            amount: Math.abs(parseFloat(String(row[1] || '0'))),
            type: String(row[2] || '').toLowerCase().includes('credit') ? 'credit' : 'debit',
            description: String(row[3] || 'No description'),
            category: String(row[4] || 'General')
          }));
          resolve(transactions);
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const parsePDF = async (file: File) => {
    const reader = new FileReader();
    return new Promise<string>((resolve, reject) => {
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument({ data }).promise;
          let fullText = '';
          
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += pageText + '\n';
          }
          resolve(fullText);
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsParsing(true);
    try {
      if (file.type === 'application/pdf') {
        const text = await parsePDF(file);
        onUpload(text);
      } else if (
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel' ||
        file.name.endsWith('.csv')
      ) {
        const transactions = await parseExcel(file);
        onUpload(transactions);
      } else {
        // Fallback to text reading for CSV if type is weird
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          onUpload(text);
        };
        reader.readAsText(file);
      }
    } catch (err) {
      console.error("Failed to parse file", err);
      alert("Failed to parse file. Please ensure it is a valid PDF or Excel statement.");
    } finally {
      setIsParsing(false);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    multiple: false,
    disabled: isLoading || isParsing
  } as any);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={cn(
          "relative group cursor-pointer rounded-2xl border-2 border-dashed p-12 transition-all duration-300",
          isDragActive ? "border-accent-green bg-brand-50" : "border-slate-200 hover:border-accent-green hover:bg-slate-50",
          (isLoading || isParsing) && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center text-accent-green group-hover:scale-110 transition-transform duration-300">
            {isParsing ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-800">
              {isParsing ? "Parsing document..." : isLoading ? "Analyzing your history..." : "Upload Financial Statement"}
            </h3>
            <p className="text-slate-500 max-w-xs mx-auto">
              Drag and drop your 6-month M-Pesa statement or Bank statement (PDF/Excel).
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> PDF / Excel / CSV</span>
            <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Last 6 Months</span>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
        <h4 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-tight">Accepted Documents</h4>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />
            M-Pesa 6-month transaction history
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
            Bank statement for the last 6 months
          </li>
        </ul>
      </div>
    </div>
  );
}
