import { useState, useRef } from 'react';
import { Upload, Download, RotateCcw, RotateCw, ArrowLeftRight, ArrowUpDown } from 'lucide-react';
import { rotateAndFlipImageFile, formatFileSize, triggerDownload } from '../../utils/imageUtils';

export default function ImageRotateTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [rotation, setRotation] = useState<0 | 90 | 180 | 270>(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) return;
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    applyTransform(selectedFile, 0, false, false);
  };

  const applyTransform = async (
    f: File,
    rot: 0 | 90 | 180 | 270,
    h: boolean,
    v: boolean
  ) => {
    try {
      const blob = await rotateAndFlipImageFile(f, rot, h, v, f.type || 'image/png');
      setResultBlob(blob);
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRotate = (deg: 90 | 180 | 270) => {
    const newRot = ((rotation + deg) % 360) as 0 | 90 | 180 | 270;
    setRotation(newRot);
    if (file) applyTransform(file, newRot, flipH, flipV);
  };

  const handleFlipH = () => {
    const newH = !flipH;
    setFlipH(newH);
    if (file) applyTransform(file, rotation, newH, flipV);
  };

  const handleFlipV = () => {
    const newV = !flipV;
    setFlipV(newV);
    if (file) applyTransform(file, rotation, flipH, newV);
  };

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    triggerDownload(resultBlob, `${baseName}_rotated.png`);
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
            <RotateCw className="w-7 h-7" />
          </div>
          <p className="text-base sm:text-lg font-bold text-slate-800 mb-1">
            Choose an image to rotate or flip
          </p>
          <p className="text-xs sm:text-sm text-slate-500">
            Rotate 90°, 180°, 270°, or mirror horizontally and vertically.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Action Toolbar */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleRotate(90)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5 text-indigo-600" />
                <span>Rotate +90°</span>
              </button>

              <button
                onClick={() => handleRotate(180)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5 text-indigo-600" />
                <span>Rotate 180°</span>
              </button>

              <button
                onClick={() => handleRotate(270)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5 text-indigo-600" />
                <span>Rotate 270°</span>
              </button>

              <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

              <button
                onClick={handleFlipH}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border rounded-lg shadow-2xs transition-colors cursor-pointer ${
                  flipH
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-400'
                }`}
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Flip Horizontal</span>
              </button>

              <button
                onClick={handleFlipV}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border rounded-lg shadow-2xs transition-colors cursor-pointer ${
                  flipV
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-400'
                }`}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Flip Vertical</span>
              </button>
            </div>

            <button
              onClick={() => {
                setRotation(0);
                setFlipH(false);
                setFlipV(false);
                applyTransform(file, 0, false, false);
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Orientation</span>
            </button>
          </div>

          {/* Live Preview */}
          <div className="h-80 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center p-4 relative overflow-hidden">
            {resultUrl ? (
              <img
                src={resultUrl}
                alt="Transformed"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <span className="text-xs text-slate-400">Processing...</span>
            )}
            <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-md">
              Rotation: {rotation}° {flipH && '• Flipped Horizontally'} {flipV && '• Flipped Vertically'}
            </div>
          </div>

          {/* Download CTA */}
          <div className="flex justify-end">
            <button
              onClick={handleDownload}
              disabled={!resultBlob}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              <span>Download Rotated Image</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
