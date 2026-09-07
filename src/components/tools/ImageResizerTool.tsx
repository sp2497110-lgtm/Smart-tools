import { useState, useRef, useEffect } from 'react';
import { Upload, Download, RotateCcw, Scaling, Link, Unlink } from 'lucide-react';
import { resizeImageFile, formatFileSize, triggerDownload, loadImageFromFile } from '../../utils/imageUtils';

export default function ImageResizerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [origWidth, setOrigWidth] = useState(0);
  const [origHeight, setOrigHeight] = useState(0);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [keepAspect, setKeepAspect] = useState(true);

  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) return;
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));

    const img = await loadImageFromFile(selectedFile);
    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    setOrigWidth(w);
    setOrigHeight(h);
    setWidth(w);
    setHeight(h);

    generateResized(selectedFile, w, h);
  };

  const generateResized = async (f: File, w: number, h: number) => {
    setIsProcessing(true);
    try {
      const blob = await resizeImageFile(f, w, h, f.type || 'image/png');
      setResultBlob(blob);
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (keepAspect && origWidth > 0) {
      const ratio = origHeight / origWidth;
      const newH = Math.round(val * ratio);
      setHeight(newH);
      if (file) generateResized(file, val, newH);
    } else if (file) {
      generateResized(file, val, height);
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (keepAspect && origHeight > 0) {
      const ratio = origWidth / origHeight;
      const newW = Math.round(val * ratio);
      setWidth(newW);
      if (file) generateResized(file, newW, val);
    } else if (file) {
      generateResized(file, width, val);
    }
  };

  const applyScale = (factor: number) => {
    const newW = Math.round(origWidth * factor);
    const newH = Math.round(origHeight * factor);
    setWidth(newW);
    setHeight(newH);
    if (file) generateResized(file, newW, newH);
  };

  const applyPreset = (presetW: number, presetH: number) => {
    setWidth(presetW);
    setHeight(presetH);
    if (file) generateResized(file, presetW, presetH);
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setResultBlob(null);
    setResultUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    triggerDownload(resultBlob, `${baseName}_resized_${width}x${height}.png`);
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
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            className="hidden"
          />
          <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
            <Scaling className="w-7 h-7" />
          </div>
          <p className="text-base sm:text-lg font-bold text-slate-800 mb-1">
            Choose an image to resize
          </p>
          <p className="text-xs sm:text-sm text-slate-500">
            Supports custom pixel dimensions, percentage scaling, and social media presets.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Original Resolution: {origWidth} × {origHeight} px ({formatFileSize(file.size)})
              </span>
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Upload New Image</span>
              </button>
            </div>

            {/* Dimension Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Width (px)</label>
                <input
                  type="number"
                  min="16"
                  max="10000"
                  value={width}
                  onChange={(e) => handleWidthChange(parseInt(e.target.value, 10) || 16)}
                  className="w-full px-3 py-2 text-sm font-semibold bg-white border border-slate-200 rounded-lg focus:outline-indigo-500"
                />
              </div>

              <div className="flex sm:justify-center items-center pb-2">
                <button
                  onClick={() => setKeepAspect(!keepAspect)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    keepAspect
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  {keepAspect ? <Link className="w-3.5 h-3.5" /> : <Unlink className="w-3.5 h-3.5" />}
                  <span>{keepAspect ? 'Aspect Ratio Locked' : 'Free Resize'}</span>
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Height (px)</label>
                <input
                  type="number"
                  min="16"
                  max="10000"
                  value={height}
                  onChange={(e) => handleHeightChange(parseInt(e.target.value, 10) || 16)}
                  className="w-full px-3 py-2 text-sm font-semibold bg-white border border-slate-200 rounded-lg focus:outline-indigo-500"
                />
              </div>
            </div>

            {/* Quick Percentage Scaling */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-medium text-slate-500">Quick Scale:</span>
              {[0.25, 0.5, 0.75, 1.5, 2].map((factor) => (
                <button
                  key={factor}
                  onClick={() => applyScale(factor)}
                  className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 hover:border-indigo-400 rounded-md text-slate-700 transition-colors cursor-pointer"
                >
                  {factor * 100}%
                </button>
              ))}
            </div>

            {/* Social Media Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/60">
              <span className="text-xs font-medium text-slate-500">Presets:</span>
              <button
                onClick={() => applyPreset(1080, 1080)}
                className="px-2.5 py-1 text-xs font-medium bg-white border border-slate-200 hover:border-indigo-400 rounded-md text-slate-700 transition-colors cursor-pointer"
              >
                Square (1080×1080)
              </button>
              <button
                onClick={() => applyPreset(1920, 1080)}
                className="px-2.5 py-1 text-xs font-medium bg-white border border-slate-200 hover:border-indigo-400 rounded-md text-slate-700 transition-colors cursor-pointer"
              >
                Full HD (1920×1080)
              </button>
              <button
                onClick={() => applyPreset(1200, 630)}
                className="px-2.5 py-1 text-xs font-medium bg-white border border-slate-200 hover:border-indigo-400 rounded-md text-slate-700 transition-colors cursor-pointer"
              >
                OpenGraph Banner (1200×630)
              </button>
              <button
                onClick={() => applyPreset(512, 512)}
                className="px-2.5 py-1 text-xs font-medium bg-white border border-slate-200 hover:border-indigo-400 rounded-md text-slate-700 transition-colors cursor-pointer"
              >
                App Icon (512×512)
              </button>
            </div>
          </div>

          {/* Resized Result Preview */}
          <div className="h-64 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center p-2 relative overflow-hidden">
            {resultUrl ? (
              <img src={resultUrl} alt="Resized" className="max-h-full max-w-full object-contain" />
            ) : (
              <div className="text-xs text-slate-400">Rendering preview...</div>
            )}
            {resultBlob && (
              <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-md">
                {width} × {height} px • {formatFileSize(resultBlob.size)}
              </div>
            )}
          </div>

          {/* Download CTA */}
          <div className="flex justify-end">
            <button
              onClick={handleDownload}
              disabled={!resultBlob}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              <span>Download Resized Image</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
