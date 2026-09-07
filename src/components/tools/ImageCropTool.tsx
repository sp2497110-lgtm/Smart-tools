import { useState, useRef } from 'react';
import { Upload, Download, RotateCcw, Crop as CropIcon } from 'lucide-react';
import { cropImageFile, formatFileSize, triggerDownload, loadImageFromFile } from '../../utils/imageUtils';

export default function ImageCropTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imgDims, setImgDims] = useState({ width: 0, height: 0 });

  // Crop box parameters in percentages of original (0 - 100)
  const [aspectPreset, setAspectPreset] = useState<'free' | '1:1' | '4:3' | '16:9' | 'orig'>('free');
  const [cropBox, setCropBox] = useState({ x: 10, y: 10, w: 80, h: 80 });

  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) return;
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));

    const img = await loadImageFromFile(selectedFile);
    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    setImgDims({ width: w, height: h });

    // Initial default crop (centered 80%)
    const initialBox = { x: 10, y: 10, w: 80, h: 80 };
    setCropBox(initialBox);
    executeCrop(selectedFile, initialBox, w, h);
  };

  const executeCrop = async (
    f: File,
    box: { x: number; y: number; w: number; h: number },
    naturalW: number,
    naturalH: number
  ) => {
    try {
      const realX = Math.round((box.x / 100) * naturalW);
      const realY = Math.round((box.y / 100) * naturalH);
      const realW = Math.max(1, Math.round((box.w / 100) * naturalW));
      const realH = Math.max(1, Math.round((box.h / 100) * naturalH));

      const blob = await cropImageFile(
        f,
        { x: realX, y: realY, width: realW, height: realH },
        f.type || 'image/png'
      );
      setCroppedBlob(blob);
      setCroppedUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
    }
  };

  const handlePresetSelect = (preset: 'free' | '1:1' | '4:3' | '16:9' | 'orig') => {
    setAspectPreset(preset);
    if (!file || imgDims.width === 0) return;

    let targetRatio = 1.0;
    if (preset === '1:1') targetRatio = 1.0;
    else if (preset === '4:3') targetRatio = 4 / 3;
    else if (preset === '16:9') targetRatio = 16 / 9;
    else if (preset === 'orig') targetRatio = imgDims.width / imgDims.height;
    else {
      // free
      const newBox = { x: 10, y: 10, w: 80, h: 80 };
      setCropBox(newBox);
      executeCrop(file, newBox, imgDims.width, imgDims.height);
      return;
    }

    // Fit maximum centered rect matching aspect ratio
    const currentImgRatio = imgDims.width / imgDims.height;
    let newWPercent = 80;
    let newHPercent = 80;

    if (targetRatio > currentImgRatio) {
      newWPercent = 90;
      const targetPixelH = (imgDims.width * 0.9) / targetRatio;
      newHPercent = Math.min(90, (targetPixelH / imgDims.height) * 100);
    } else {
      newHPercent = 90;
      const targetPixelW = imgDims.height * 0.9 * targetRatio;
      newWPercent = Math.min(90, (targetPixelW / imgDims.width) * 100);
    }

    const newX = (100 - newWPercent) / 2;
    const newY = (100 - newHPercent) / 2;
    const box = { x: newX, y: newY, w: newWPercent, h: newHPercent };
    setCropBox(box);
    executeCrop(file, box, imgDims.width, imgDims.height);
  };

  const handleDownload = () => {
    if (!croppedBlob || !file) return;
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    triggerDownload(croppedBlob, `${baseName}_cropped.png`);
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
            <CropIcon className="w-7 h-7" />
          </div>
          <p className="text-base sm:text-lg font-bold text-slate-800 mb-1">
            Choose an image to crop
          </p>
          <p className="text-xs sm:text-sm text-slate-500">
            Interactive cropping with Free, 1:1, 4:3, 16:9, and Original aspect ratios.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Preset Buttons */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-600 mr-1">Aspect Ratio:</span>
              {(['free', '1:1', '4:3', '16:9', 'orig'] as const).map((preset) => (
                <button
                  key={preset}
                  onClick={() => handlePresetSelect(preset)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    aspectPreset === preset
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {preset === 'free'
                    ? 'Free'
                    : preset === 'orig'
                    ? 'Original'
                    : preset}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setFile(null);
                setPreviewUrl(null);
                setCroppedBlob(null);
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Interactive Bounding Adjuster (Sliders for X, Y, Width, Height) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50/70 border border-slate-200/60 rounded-xl text-xs">
            <div>
              <span className="font-semibold text-slate-600 block mb-1">Crop Width ({Math.round(cropBox.w)}%)</span>
              <input
                type="range"
                min="20"
                max="100"
                value={cropBox.w}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  const newX = Math.min(cropBox.x, 100 - val);
                  const b = { ...cropBox, w: val, x: newX };
                  setCropBox(b);
                  executeCrop(file, b, imgDims.width, imgDims.height);
                }}
                className="w-full"
              />
            </div>
            <div>
              <span className="font-semibold text-slate-600 block mb-1">Crop Height ({Math.round(cropBox.h)}%)</span>
              <input
                type="range"
                min="20"
                max="100"
                value={cropBox.h}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  const newY = Math.min(cropBox.y, 100 - val);
                  const b = { ...cropBox, h: val, y: newY };
                  setCropBox(b);
                  executeCrop(file, b, imgDims.width, imgDims.height);
                }}
                className="w-full"
              />
            </div>
            <div>
              <span className="font-semibold text-slate-600 block mb-1">Horizontal Position ({Math.round(cropBox.x)}%)</span>
              <input
                type="range"
                min="0"
                max={100 - cropBox.w}
                value={cropBox.x}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  const b = { ...cropBox, x: val };
                  setCropBox(b);
                  executeCrop(file, b, imgDims.width, imgDims.height);
                }}
                className="w-full"
              />
            </div>
            <div>
              <span className="font-semibold text-slate-600 block mb-1">Vertical Position ({Math.round(cropBox.y)}%)</span>
              <input
                type="range"
                min="0"
                max={100 - cropBox.h}
                value={cropBox.y}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  const b = { ...cropBox, y: val };
                  setCropBox(b);
                  executeCrop(file, b, imgDims.width, imgDims.height);
                }}
                className="w-full"
              />
            </div>
          </div>

          {/* Side by side Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-500">Source Image with Crop Guide</span>
              <div className="h-64 bg-slate-100 rounded-xl border border-slate-200 relative overflow-hidden flex items-center justify-center p-2">
                {previewUrl && (
                  <img src={previewUrl} alt="Source" className="max-h-full max-w-full object-contain" />
                )}
                {/* Visual crop border overlay */}
                <div
                  className="absolute border-2 border-indigo-500 bg-indigo-500/15 pointer-events-none rounded-xs"
                  style={{
                    left: `${cropBox.x}%`,
                    top: `${cropBox.y}%`,
                    width: `${cropBox.w}%`,
                    height: `${cropBox.h}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-indigo-700">Cropped Result Preview</span>
              <div className="h-64 bg-slate-100 rounded-xl border border-indigo-200 flex items-center justify-center p-2 overflow-hidden">
                {croppedUrl ? (
                  <img src={croppedUrl} alt="Cropped" className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-xs text-slate-400">Rendering crop...</span>
                )}
              </div>
            </div>
          </div>

          {/* Download CTA */}
          <div className="flex justify-end">
            <button
              onClick={handleDownload}
              disabled={!croppedBlob}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              <span>Download Cropped Image</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
