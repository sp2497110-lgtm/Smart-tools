import { useState, useRef } from 'react';
import { Upload, Download, RotateCcw, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { compressPdfFile, formatFileSize } from '../../utils/pdfUtils';
import { triggerDownload } from '../../utils/imageUtils';

export default function PdfCompressorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [stats, setStats] = useState<{ original: number; compressed: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) return;
    setFile(selectedFile);
    setIsProcessing(true);

    try {
      const res = await compressPdfFile(selectedFile);
      setCompressedBlob(res.blob);
      setStats({
        original: res.originalSize,
        compressed: res.finalSize,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedBlob || !file) return;
    const base = file.name.replace(/\.[^/.]+$/, '');
    triggerDownload(compressedBlob, `${base}_compressed.pdf`);
  };

  const handleReset = () => {
    setFile(null);
    setCompressedBlob(null);
    setStats(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const savedPercent =
    stats && stats.original > 0
      ? Math.max(0, Math.round(((stats.original - stats.compressed) / stats.original) * 100))
      : 0;

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
            <FileText className="w-7 h-7" />
          </div>
          <p className="text-base sm:text-lg font-bold text-slate-800 mb-1">
            Choose a PDF document to compress
          </p>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
            Optimizes internal document streams and removes redundant objects directly inside your browser.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                PDF
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm truncate max-w-xs sm:max-w-md">
                  {file.name}
                </h3>
                <span className="text-xs text-slate-500">
                  Original: {formatFileSize(file.size)}
                </span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Choose Another PDF</span>
            </button>
          </div>

          {isProcessing ? (
            <div className="flex flex-col items-center justify-center py-12 text-indigo-600 gap-3">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-sm font-semibold">Compacting PDF streams client-side...</p>
            </div>
          ) : stats && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs font-medium text-slate-500">Original Size</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">
                    {formatFileSize(stats.original)}
                  </div>
                </div>

                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <div className="text-xs font-medium text-indigo-700">Optimized Size</div>
                  <div className="text-lg font-extrabold text-indigo-950 mt-0.5">
                    {formatFileSize(stats.compressed)}
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <div className="text-xs font-medium text-emerald-700">Storage Saved</div>
                  <div className="text-lg font-extrabold text-emerald-950 mt-0.5">
                    {savedPercent}%
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs sm:text-sm border border-emerald-200">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  PDF optimization complete. Internal font metrics, stream objects, and content trees were successfully compressed.
                </span>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleDownload}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Optimized PDF ({formatFileSize(stats.compressed)})</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
