import { useState, useRef } from 'react';
import { Upload, Download, RotateCcw, ArrowRightLeft, Palette } from 'lucide-react';
import { convertImageFile, formatFileSize, triggerDownload } from '../../utils/imageUtils';

interface Props {
  sourceFormat: 'jpg' | 'png' | 'webp';
  targetFormat: 'jpg' | 'png' | 'webp';
}

export default function ImageConvertTool({ sourceFormat, targetFormat }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [quality, setQuality] = useState<number>(0.92);

  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) return;
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    runConversion(selectedFile, bgColor, quality);
  };

  const runConversion = async (f: File, bg: string, q: number) => {
    setIsProcessing(true);
    try {
      const mime =
        targetFormat === 'png'
          ? 'image/png'
          : targetFormat === 'webp'
          ? 'image/webp'
          : 'image/jpeg';
      const blob = await convertImageFile(f, mime, bg, q);
      setConvertedBlob(blob);
      setConvertedUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!convertedBlob || !file) return;
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const ext = targetFormat;
    triggerDownload(convertedBlob, `${baseName}.${ext}`);
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setConvertedBlob(null);
    setConvertedUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
            <ArrowRightLeft className="w-7 h-7" />
          </div>
          <p className="text-base sm:text-lg font-bold text-slate-800 mb-1">
            Choose {sourceFormat.toUpperCase()} image to convert
          </p>
          <p className="text-xs sm:text-sm text-slate-500">
            Convert to {targetFormat.toUpperCase()} with 100% browser-level fidelity.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls */}
          <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Conversion Options
              </span>
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Choose Another File</span>
              </button>
            </div>

            {/* If converting PNG to JPG, show background color picker to avoid black background */}
            {sourceFormat === 'png' && targetFormat === 'jpg' && (
              <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-amber-900 block">
                    Transparent Background Fill:
                  </span>
                  <span className="text-amber-700">
                    JPG doesn't support transparency. Choose what color replaces transparent areas.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setBgColor('#FFFFFF');
                      runConversion(file, '#FFFFFF', quality);
                    }}
                    className={`px-2.5 py-1 rounded-md font-semibold border ${
                      bgColor === '#FFFFFF'
                        ? 'bg-white text-slate-900 border-indigo-500 shadow-xs'
                        : 'bg-white/80 text-slate-600'
                    }`}
                  >
                    White
                  </button>
                  <button
                    onClick={() => {
                      setBgColor('#000000');
                      runConversion(file, '#000000', quality);
                    }}
                    className={`px-2.5 py-1 rounded-md font-semibold border ${
                      bgColor === '#000000'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white/80 text-slate-600'
                    }`}
                  >
                    Black
                  </button>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => {
                      setBgColor(e.target.value);
                      runConversion(file, e.target.value, quality);
                    }}
                    className="w-8 h-8 rounded-md cursor-pointer border border-slate-300"
                    title="Custom Background Color"
                  />
                </div>
              </div>
            )}

            {/* Quality control for lossy formats */}
            {(targetFormat === 'jpg' || targetFormat === 'webp') && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Compression Quality</span>
                  <span>{Math.round(quality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={quality}
                  onChange={(e) => {
                    const q = parseFloat(e.target.value);
                    setQuality(q);
                    runConversion(file, bgColor, q);
                  }}
                  className="w-full cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Previews */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Original {sourceFormat.toUpperCase()}</span>
                <span>{formatFileSize(file.size)}</span>
              </div>
              <div className="h-56 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center p-2">
                {previewUrl && (
                  <img src={previewUrl} alt="Source" className="max-h-full max-w-full object-contain" />
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-indigo-700">
                <span>Converted {targetFormat.toUpperCase()}</span>
                {convertedBlob && <span>{formatFileSize(convertedBlob.size)}</span>}
              </div>
              <div className="h-56 bg-slate-100 rounded-xl border border-indigo-200 flex items-center justify-center p-2">
                {convertedUrl && (
                  <img src={convertedUrl} alt="Converted" className="max-h-full max-w-full object-contain" />
                )}
              </div>
            </div>
          </div>

          {/* Download CTA */}
          <div className="flex justify-end">
            <button
              onClick={handleDownload}
              disabled={!convertedBlob}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              <span>Download {targetFormat.toUpperCase()} Image</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
