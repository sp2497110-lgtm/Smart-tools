import { useState, useRef, useEffect } from 'react';
import { Upload, Download, RotateCcw, AlertCircle, CheckCircle, Image as ImageIcon, Loader2 } from 'lucide-react';
import { ToolDefinition } from '../../types';
import {
  compressImageToTarget,
  compressImageManual,
  formatFileSize,
  triggerDownload,
  CompressionResult,
} from '../../utils/imageUtils';

interface Props {
  tool: ToolDefinition;
}

export default function ImageCompressorTool({ tool }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/webp' | 'image/png'>('image/jpeg');

  // Mode: target size vs manual quality
  const [mode, setMode] = useState<'target' | 'manual'>(tool.targetKb ? 'target' : 'target');
  const [targetKb, setTargetKb] = useState<number>(tool.targetKb || 50);
  const [customKb, setCustomKb] = useState<string>(String(tool.targetKb || 50));
  const [manualQuality, setManualQuality] = useState<number>(0.8);

  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync when tool prop changes (e.g. navigation from 50kb to 200kb)
  useEffect(() => {
    if (tool.targetKb) {
      setMode('target');
      setTargetKb(tool.targetKb);
      setCustomKb(String(tool.targetKb));
      if (file) {
        runCompression(file, 'target', tool.targetKb, outputFormat, manualQuality);
      }
    }
  }, [tool.targetKb]);

  const handleFileChange = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, or WebP).');
      return;
    }
    setError(null);
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    runCompression(selectedFile, mode, targetKb, outputFormat, manualQuality);
  };

  const runCompression = async (
    currentFile: File,
    currentMode: 'target' | 'manual',
    currentTargetKb: number,
    currentFormat: 'image/jpeg' | 'image/webp' | 'image/png',
    currentQuality: number
  ) => {
    setIsProcessing(true);
    setError(null);
    try {
      let res: CompressionResult;
      if (currentMode === 'target') {
        const targetBytes = currentTargetKb * 1024;
        res = await compressImageToTarget(currentFile, targetBytes, currentFormat);
      } else {
        res = await compressImageManual(currentFile, currentQuality, currentFormat);
      }
      setResult(res);
    } catch (err: any) {
      setError(err?.message || 'Failed to compress image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const ext = outputFormat === 'image/jpeg' ? 'jpg' : outputFormat === 'image/webp' ? 'webp' : 'png';
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const outName = `${baseName}_compressed.${ext}`;
    triggerDownload(result.blob, outName);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-7 shadow-xs">
      {/* Upload Box */}
      {!file ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) handleFileChange(e.dataTransfer.files[0]);
          }}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50/60 hover:bg-indigo-50/30 rounded-2xl p-8 sm:p-14 text-center cursor-pointer transition-all flex flex-col items-center justify-center group"
          id="image-dropzone"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            className="hidden"
          />
          <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-7 h-7" />
          </div>
          <p className="text-base sm:text-lg font-bold text-slate-800 mb-1">
            Choose an image or drag &amp; drop here
          </p>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
            Supports JPG, JPEG, PNG, and WebP. Processed locally in your browser memory.
          </p>
          {tool.targetKb && (
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200/60">
              Target: Under {tool.targetKb} KB
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 p-5 bg-slate-50/80 border border-slate-200/80 rounded-xl">
            {/* Target Size vs Quality Selector */}
            <div className="space-y-2 lg:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Compression Mode
                </label>
                <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-xs font-semibold">
                  <button
                    onClick={() => {
                      setMode('target');
                      runCompression(file, 'target', targetKb, outputFormat, manualQuality);
                    }}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                      mode === 'target' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Target File Size
                  </button>
                  <button
                    onClick={() => {
                      setMode('manual');
                      runCompression(file, 'manual', targetKb, outputFormat, manualQuality);
                    }}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                      mode === 'manual' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Quality Slider
                  </button>
                </div>
              </div>

              {mode === 'target' ? (
                <div className="space-y-2.5 pt-1">
                  <div className="flex flex-wrap gap-1.5">
                    {[20, 50, 100, 150, 200, 500, 1000].map((kb) => (
                      <button
                        key={kb}
                        onClick={() => {
                          setTargetKb(kb);
                          setCustomKb(String(kb));
                          runCompression(file, 'target', kb, outputFormat, manualQuality);
                        }}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                          targetKb === kb
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {kb >= 1000 ? `${kb / 1000} MB` : `${kb} KB`}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs text-slate-500 font-medium">Custom Target:</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="5"
                        max="10000"
                        value={customKb}
                        onChange={(e) => setCustomKb(e.target.value)}
                        onBlur={() => {
                          const val = Math.max(5, parseInt(customKb, 10) || 50);
                          setTargetKb(val);
                          runCompression(file, 'target', val, outputFormat, manualQuality);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = Math.max(5, parseInt(customKb, 10) || 50);
                            setTargetKb(val);
                            runCompression(file, 'target', val, outputFormat, manualQuality);
                          }
                        }}
                        className="w-20 px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 rounded-lg focus:outline-indigo-500"
                      />
                      <span className="text-xs text-slate-500">KB</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>Output Quality</span>
                    <span>{Math.round(manualQuality * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="1.0"
                    step="0.05"
                    value={manualQuality}
                    onChange={(e) => {
                      const q = parseFloat(e.target.value);
                      setManualQuality(q);
                      runCompression(file, 'manual', targetKb, outputFormat, q);
                    }}
                    className="w-full cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Output Format Picker */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                Output Format
              </label>
              <select
                value={outputFormat}
                onChange={(e) => {
                  const fmt = e.target.value as any;
                  setOutputFormat(fmt);
                  runCompression(file, mode, targetKb, fmt, manualQuality);
                }}
                className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-lg focus:outline-indigo-500 cursor-pointer"
              >
                <option value="image/jpeg">JPG / JPEG (Best Compression)</option>
                <option value="image/webp">WebP (Modern Next-Gen)</option>
                <option value="image/png">PNG (Lossless / High Detail)</option>
              </select>

              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Upload Different Image</span>
              </button>
            </div>
          </div>

          {/* Loading Indicator */}
          {isProcessing && (
            <div className="flex items-center justify-center gap-2 py-8 text-indigo-600 font-semibold text-sm">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Optimizing image algorithms in browser...</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Results Comparison Card */}
          {result && !isProcessing && (
            <div className="space-y-6">
              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <div className="text-[11px] font-medium text-slate-500">Original Size</div>
                  <div className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                    {formatFileSize(result.originalSize)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {result.originalWidth} × {result.originalHeight} px
                  </div>
                </div>

                <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl">
                  <div className="text-[11px] font-medium text-indigo-700">Compressed Size</div>
                  <div className="text-base sm:text-lg font-extrabold text-indigo-950 mt-0.5">
                    {formatFileSize(result.finalSize)}
                  </div>
                  <div className="text-[10px] text-indigo-600 font-semibold">
                    {result.finalWidth} × {result.finalHeight} px
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-xl">
                  <div className="text-[11px] font-medium text-emerald-700">Saved Space</div>
                  <div className="text-base sm:text-lg font-extrabold text-emerald-950 mt-0.5">
                    {result.savedPercent}%
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold">
                    -{formatFileSize(result.savedBytes)}
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <div className="text-[11px] font-medium text-slate-500">Status</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    {result.achievedTarget ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-xs font-bold text-emerald-700 truncate">
                          Target Reached
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span className="text-xs font-bold text-amber-700 truncate">
                          Optimal Limit
                        </span>
                      </>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    Quality: {Math.round(result.quality * 100)}%
                  </div>
                </div>
              </div>

              {/* Status Message */}
              {result.message && (
                <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
                  <span className="font-semibold text-slate-800">Verification note: </span>
                  {result.message}
                </div>
              )}

              {/* Preview Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-500">Original Image</span>
                  <div className="h-60 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center p-2">
                    {previewUrl && (
                      <img
                        src={previewUrl}
                        alt="Original"
                        className="max-h-full max-w-full object-contain"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-indigo-700">Compressed Output</span>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm">
                      {formatFileSize(result.finalSize)}
                    </span>
                  </div>
                  <div className="h-60 bg-slate-100 rounded-xl border border-indigo-200 overflow-hidden flex items-center justify-center p-2 relative">
                    <img
                      src={result.dataUrl}
                      alt="Compressed"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Download CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                <button
                  onClick={handleDownload}
                  className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  id="download-compressed-image-btn"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Compressed Image ({formatFileSize(result.finalSize)})</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
