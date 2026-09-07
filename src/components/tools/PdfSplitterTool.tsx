import { useState, useRef } from 'react';
import { Upload, Download, RotateCcw, Scissors, Loader2, Archive } from 'lucide-react';
import { getPdfPageCount, extractPdfPages, extractAllPagesToZip } from '../../utils/pdfUtils';
import { triggerDownload } from '../../utils/imageUtils';

export default function PdfSplitterTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [mode, setMode] = useState<'range' | 'all'>('range');
  const [rangeStr, setRangeStr] = useState<string>('1');

  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [isZip, setIsZip] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) return;
    setFile(selectedFile);
    setError(null);
    setResultBlob(null);

    try {
      const count = await getPdfPageCount(selectedFile);
      setPageCount(count);
      setRangeStr(count > 1 ? `1-${Math.min(2, count)}` : '1');
    } catch (err: any) {
      setError('Could not inspect PDF pages. File might be encrypted.');
    }
  };

  const handleSplit = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      if (mode === 'all') {
        const zipBlob = await extractAllPagesToZip(file);
        setResultBlob(zipBlob);
        setIsZip(true);
      } else {
        // parse range string like "1-3, 5"
        const pages: number[] = [];
        const parts = rangeStr.split(',').map((p) => p.trim());
        for (const part of parts) {
          if (part.includes('-')) {
            const [start, end] = part.split('-').map((n) => parseInt(n.trim(), 10));
            if (!isNaN(start) && !isNaN(end)) {
              for (let i = Math.max(1, start); i <= Math.min(pageCount, end); i++) {
                pages.push(i);
              }
            }
          } else {
            const num = parseInt(part, 10);
            if (!isNaN(num) && num >= 1 && num <= pageCount) {
              pages.push(num);
            }
          }
        }

        const uniquePages = Array.from(new Set(pages)).sort((a, b) => a - b);
        if (uniquePages.length === 0) {
          throw new Error('Please enter a valid page number or range within the document.');
        }

        const pdfBlob = await extractPdfPages(file, uniquePages);
        setResultBlob(pdfBlob);
        setIsZip(false);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to split PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    const base = file.name.replace(/\.[^/.]+$/, '');
    if (isZip) {
      triggerDownload(resultBlob, `${base}_pages.zip`);
    } else {
      triggerDownload(resultBlob, `${base}_extracted.pdf`);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-7 shadow-xs">
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) handleFileChange(e.dataTransfer.files[0]);
          }}
          className="border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50/60 rounded-2xl p-8 sm:p-14 text-center cursor-pointer transition-all flex flex-col items-center justify-center group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            className="hidden"
          />
          <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
            <Scissors className="w-7 h-7" />
          </div>
          <p className="text-base sm:text-lg font-bold text-slate-800 mb-1">
            Choose a PDF document to split
          </p>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
            Extract custom page ranges into a new PDF or download every page as a ZIP file.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm truncate max-w-xs sm:max-w-md">
                {file.name}
              </h3>
              <span className="text-xs text-indigo-600 font-semibold">
                Total Pages: {pageCount}
              </span>
            </div>

            <button
              onClick={() => {
                setFile(null);
                setResultBlob(null);
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Change PDF</span>
            </button>
          </div>

          {/* Split Mode Selector */}
          <div className="p-5 bg-slate-50/80 border border-slate-200/80 rounded-xl space-y-4">
            <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-xs font-semibold max-w-xs">
              <button
                onClick={() => {
                  setMode('range');
                  setResultBlob(null);
                }}
                className={`flex-1 py-1.5 rounded-md transition-all cursor-pointer ${
                  mode === 'range' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                Extract Range
              </button>
              <button
                onClick={() => {
                  setMode('all');
                  setResultBlob(null);
                }}
                className={`flex-1 py-1.5 rounded-md transition-all cursor-pointer ${
                  mode === 'all' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                Separate All (ZIP)
              </button>
            </div>

            {mode === 'range' ? (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Page Selection (e.g. "1-3, 5")
                </label>
                <input
                  type="text"
                  value={rangeStr}
                  onChange={(e) => setRangeStr(e.target.value)}
                  placeholder={`1-${pageCount}`}
                  className="w-full sm:w-80 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg font-mono focus:outline-indigo-500"
                />
                <span className="text-xs text-slate-400 block">
                  Supported format: single numbers (2, 4) or hyphen ranges (1-5).
                </span>
              </div>
            ) : (
              <p className="text-xs text-slate-600 leading-normal">
                Every single page in this {pageCount}-page PDF will be extracted into its own standalone PDF file and packaged into a convenient .zip archive.
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs sm:text-sm rounded-xl border border-red-200">
              {error}
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end">
            {!resultBlob ? (
              <button
                onClick={handleSplit}
                disabled={isProcessing}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Extracting Pages...</span>
                  </>
                ) : (
                  <>
                    <Scissors className="w-5 h-5" />
                    <span>{mode === 'all' ? 'Extract All Pages to ZIP' : 'Extract Pages'}</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleDownload}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer animate-in zoom-in-95"
              >
                {isZip ? <Archive className="w-5 h-5" /> : <Download className="w-5 h-5" />}
                <span>Download {isZip ? 'Pages ZIP Archive' : 'Extracted PDF'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
