import { useState, useRef } from 'react';
import { Upload, Download, RotateCcw, FileImage, Loader2, Archive, CheckCircle } from 'lucide-react';
import { renderPdfPagesToImages } from '../../utils/pdfUtils';
import { triggerDownload } from '../../utils/imageUtils';
import JSZip from 'jszip';

export default function PdfToJpgTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [pageImages, setPageImages] = useState<{ pageNum: number; blob: Blob; dataUrl: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) return;
    setFile(selectedFile);
    setError(null);
    setPageImages([]);
    setIsRendering(true);
    setProgressMsg('Initializing PDF rasterizer...');

    try {
      const results = await renderPdfPagesToImages(selectedFile, 1.5, (cur, tot) => {
        setProgressMsg(`Rendering page ${cur} of ${tot}...`);
      });
      setPageImages(results);
    } catch (err: any) {
      console.error(err);
      setError('Could not render PDF pages to images. File might be protected or corrupted.');
    } finally {
      setIsRendering(false);
    }
  };

  const handleDownloadSingle = (blob: Blob, pageNum: number) => {
    if (!file) return;
    const base = file.name.replace(/\.[^/.]+$/, '');
    triggerDownload(blob, `${base}_page_${pageNum}.jpg`);
  };

  const handleDownloadAllZip = async () => {
    if (!file || pageImages.length === 0) return;
    const zip = new JSZip();
    const base = file.name.replace(/\.[^/.]+$/, '');

    pageImages.forEach((p) => {
      zip.file(`${base}_page_${p.pageNum}.jpg`, p.blob);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    triggerDownload(content, `${base}_all_pages_jpg.zip`);
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
            <FileImage className="w-7 h-7" />
          </div>
          <p className="text-base sm:text-lg font-bold text-slate-800 mb-1">
            Choose a PDF document to convert to JPG images
          </p>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
            High-definition page rendering rendered client-side. Extract individual pages or download all as a ZIP archive.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm truncate max-w-xs sm:max-w-md">
                {file.name}
              </h3>
              <span className="text-xs text-slate-500">
                {pageImages.length > 0 ? `${pageImages.length} Pages Extracted` : 'Processing...'}
              </span>
            </div>

            <button
              onClick={() => {
                setFile(null);
                setPageImages([]);
                setError(null);
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Convert Another PDF</span>
            </button>
          </div>

          {isRendering && (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-indigo-600">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-sm font-semibold">{progressMsg}</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
              {error}
            </div>
          )}

          {pageImages.length > 0 && !isRendering && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Rendered Pages ({pageImages.length})</span>
                </div>

                <button
                  onClick={handleDownloadAllZip}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Archive className="w-4 h-4" />
                  <span>Download All as ZIP</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {pageImages.map((page) => (
                  <div
                    key={page.pageNum}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
                  >
                    <div className="h-44 bg-slate-100 p-2 flex items-center justify-center overflow-hidden">
                      <img
                        src={page.dataUrl}
                        alt={`Page ${page.pageNum}`}
                        className="max-h-full max-w-full object-contain shadow-xs"
                      />
                    </div>
                    <div className="p-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                      <span className="text-xs font-semibold text-slate-700">
                        Page {page.pageNum}
                      </span>
                      <button
                        onClick={() => handleDownloadSingle(page.blob, page.pageNum)}
                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        title="Download this page"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
