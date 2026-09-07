import { useState, useRef } from 'react';
import { Upload, Download, RotateCcw, Plus, Trash2, ArrowUp, ArrowDown, FileImage, Loader2 } from 'lucide-react';
import { convertImagesToPdf } from '../../utils/pdfUtils';
import { triggerDownload } from '../../utils/imageUtils';

export default function JpgToPdfTool() {
  const [images, setImages] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState<'fit' | 'a4_portrait' | 'a4_landscape'>('fit');
  const [margin, setMargin] = useState<number>(0);

  const [isConverting, setIsConverting] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddImages = (files: FileList | null) => {
    if (!files) return;
    const valid = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (valid.length === 0) return;
    setImages((prev) => [...prev, ...valid]);
    setPdfBlob(null);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;
    const copy = [...images];
    const item = copy.splice(index, 1)[0];
    copy.splice(targetIdx, 0, item);
    setImages(copy);
    setPdfBlob(null);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPdfBlob(null);
  };

  const handleConvert = async () => {
    if (images.length === 0) return;
    setIsConverting(true);
    try {
      const blob = await convertImagesToPdf(images, pageSize, margin);
      setPdfBlob(blob);
    } catch (err) {
      console.error(err);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBlob) return;
    triggerDownload(pdfBlob, 'converted_images.pdf');
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-7 shadow-xs">
      {images.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleAddImages(e.dataTransfer.files);
          }}
          className="border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50/60 rounded-2xl p-8 sm:p-14 text-center cursor-pointer transition-all flex flex-col items-center justify-center group"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => handleAddImages(e.target.files)}
            className="hidden"
          />
          <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
            <FileImage className="w-7 h-7" />
          </div>
          <p className="text-base sm:text-lg font-bold text-slate-800 mb-1">
            Choose JPG, PNG, or WebP images to convert
          </p>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
            Combine multiple photos into a beautifully formatted single PDF document.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Options Toolbar */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
              <div>
                <label className="text-slate-600 block mb-1">Page Layout</label>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(e.target.value as any);
                    setPdfBlob(null);
                  }}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-indigo-500 cursor-pointer"
                >
                  <option value="fit">Fit to Image Size</option>
                  <option value="a4_portrait">A4 (Portrait)</option>
                  <option value="a4_landscape">A4 (Landscape)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Page Margin</label>
                <select
                  value={margin}
                  onChange={(e) => {
                    setMargin(parseInt(e.target.value, 10));
                    setPdfBlob(null);
                  }}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-indigo-500 cursor-pointer"
                >
                  <option value="0">No Margin (Full Bleed)</option>
                  <option value="20">Small Margin</option>
                  <option value="40">Large Margin</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleAddImages(e.target.files)}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-400 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-indigo-600" />
                <span>Add More Images</span>
              </button>
              <button
                onClick={() => {
                  setImages([]);
                  setPdfBlob(null);
                }}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer"
                title="Clear All"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Image Cards Queue */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-1">
            {images.map((img, idx) => (
              <div
                key={`${img.name}-${idx}`}
                className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs hover:border-indigo-400 transition-all flex flex-col"
              >
                <div className="h-32 bg-slate-100 flex items-center justify-center p-2 relative">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={img.name}
                    className="max-h-full max-w-full object-contain"
                  />
                  <span className="absolute top-1 left-1 bg-slate-900/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                    Page {idx + 1}
                  </span>
                </div>
                <div className="p-2 flex items-center justify-between border-t border-slate-100 bg-white">
                  <span className="text-xs text-slate-600 truncate max-w-[90px]">{img.name}</span>
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => moveImage(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveImage(idx, 'down')}
                      disabled={idx === images.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removeImage(idx)}
                      className="p-1 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action */}
          <div className="flex justify-end pt-2">
            {!pdfBlob ? (
              <button
                onClick={handleConvert}
                disabled={isConverting}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Compiling PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Generate PDF ({images.length} Pages)</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleDownload}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer animate-in zoom-in-95"
              >
                <Download className="w-5 h-5" />
                <span>Download Generated PDF</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
