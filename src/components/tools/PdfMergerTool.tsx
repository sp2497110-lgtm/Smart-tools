import { useState, useRef } from 'react';
import { Upload, Download, RotateCcw, ArrowUp, ArrowDown, Trash2, Plus, Layers, Loader2, CheckCircle } from 'lucide-react';
import { mergePdfFiles, formatFileSize } from '../../utils/pdfUtils';
import { triggerDownload } from '../../utils/imageUtils';

export default function PdfMergerTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const valid = Array.from(newFiles).filter(
      (f) => f.type === 'application/pdf' || f.name.endsWith('.pdf')
    );
    if (valid.length === 0) return;
    setFiles((prev) => [...prev, ...valid]);
    setMergedBlob(null);
    setError(null);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= files.length) return;
    const copy = [...files];
    const item = copy.splice(index, 1)[0];
    copy.splice(targetIdx, 0, item);
    setFiles(copy);
    setMergedBlob(null);
  };

  const removeItem = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setMergedBlob(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please add at least 2 PDF files to merge.');
      return;
    }
    setIsMerging(true);
    setError(null);
    try {
      const blob = await mergePdfFiles(files);
      setMergedBlob(blob);
    } catch (err: any) {
      setError(err?.message || 'Failed to merge PDF files.');
    } finally {
      setIsMerging(false);
    }
  };

  const handleDownload = () => {
    if (!mergedBlob) return;
    triggerDownload(mergedBlob, 'merged_document.pdf');
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-7 shadow-xs">
      {files.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleAddFiles(e.dataTransfer.files);
          }}
          className="border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50/60 rounded-2xl p-8 sm:p-14 text-center cursor-pointer transition-all flex flex-col items-center justify-center group"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="application/pdf"
            onChange={(e) => handleAddFiles(e.target.files)}
            className="hidden"
          />
          <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
            <Layers className="w-7 h-7" />
          </div>
          <p className="text-base sm:text-lg font-bold text-slate-800 mb-1">
            Choose PDF files to merge
          </p>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
            Select 2 or more PDF documents. Drag or reorder them in the exact order you want them combined.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200/80 rounded-xl">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {files.length} {files.length === 1 ? 'Document' : 'Documents'} in Queue
            </span>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="application/pdf"
                onChange={(e) => handleAddFiles(e.target.files)}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-400 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-indigo-600" />
                <span>Add More PDFs</span>
              </button>
              <button
                onClick={() => {
                  setFiles([]);
                  setMergedBlob(null);
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>
          </div>

          {/* Reorderable File List */}
          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {files.map((f, idx) => (
              <div
                key={`${f.name}-${idx}`}
                className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate max-w-xs sm:max-w-md">
                      {f.name}
                    </p>
                    <span className="text-xs text-slate-400">{formatFileSize(f.size)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveItem(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-md cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveItem(idx, 'down')}
                    disabled={idx === files.length - 1}
                    className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-md cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeItem(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-md cursor-pointer"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs sm:text-sm rounded-xl border border-red-200">
              {error}
            </div>
          )}

          {/* Merge & Download Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-xs text-slate-500">
              Reorder documents to customize the page sequence in your final PDF.
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {!mergedBlob ? (
                <button
                  onClick={handleMerge}
                  disabled={files.length < 2 || isMerging}
                  className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isMerging ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Merging Documents...</span>
                    </>
                  ) : (
                    <>
                      <Layers className="w-5 h-5" />
                      <span>Merge {files.length} PDFs</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleDownload}
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer animate-in zoom-in-95"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Combined PDF ({formatFileSize(mergedBlob.size)})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
