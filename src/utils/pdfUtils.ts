import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import * as pdfjsLib from 'pdfjs-dist';

export { formatFileSize } from './imageUtils';

// Configure PDF.js worker securely for browser execution
try {
  if (typeof window !== 'undefined' && pdfjsLib) {
    const workerVersion = (pdfjsLib as any).version || '4.10.38';
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${workerVersion}/pdf.worker.min.mjs`;
  }
} catch (e) {
  console.warn('PDF.js worker setup warning:', e);
}

/**
 * PDF Merger: Merges multiple PDF files in sequential order.
 */
export async function mergePdfFiles(files: File[]): Promise<Blob> {
  if (files.length < 2) {
    throw new Error('Please select at least 2 PDF files to merge.');
  }

  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedPdfBytes = await mergedPdf.save({ useObjectStreams: true });
  return new Blob([mergedPdfBytes], { type: 'application/pdf' });
}

/**
 * Get total page count of a PDF file.
 */
export async function getPdfPageCount(file: File): Promise<number> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  return pdf.getPageCount();
}

/**
 * Extract specific page numbers (1-indexed) into a single new PDF document.
 */
export async function extractPdfPages(file: File, pageNumbers: number[]): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const totalPages = sourcePdf.getPageCount();

  const zeroIndexed = pageNumbers
    .filter((n) => n >= 1 && n <= totalPages)
    .map((n) => n - 1);

  if (zeroIndexed.length === 0) {
    throw new Error('No valid pages found to extract.');
  }

  const targetDoc = await PDFDocument.create();
  const copiedPages = await targetDoc.copyPages(sourcePdf, zeroIndexed);
  copiedPages.forEach((page) => targetDoc.addPage(page));

  const finalBytes = await targetDoc.save({ useObjectStreams: true });
  return new Blob([finalBytes], { type: 'application/pdf' });
}

/**
 * Split each page into its own individual PDF and pack into a zip archive.
 */
export async function extractAllPagesToZip(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const totalPages = sourcePdf.getPageCount();
  const baseName = file.name.replace(/\.[^/.]+$/, '');

  const zip = new JSZip();

  for (let i = 0; i < totalPages; i++) {
    const singleDoc = await PDFDocument.create();
    const [copiedPage] = await singleDoc.copyPages(sourcePdf, [i]);
    singleDoc.addPage(copiedPage);
    const pdfBytes = await singleDoc.save();
    zip.file(`${baseName}_page_${i + 1}.pdf`, pdfBytes);
  }

  return zip.generateAsync({ type: 'blob' });
}

/**
 * PDF Splitter: Extract selected page numbers or ranges (e.g. "1-3, 5") into a new PDF,
 * or export all pages as individual PDFs packaged into a ZIP.
 */
export async function splitPdfFile(
  file: File,
  pageRangeStr: string,
  mode: 'range' | 'all' = 'range'
): Promise<{ blob: Blob; filename: string; pageCount: number }> {
  if (mode === 'all') {
    const totalPages = await getPdfPageCount(file);
    const zipBlob = await extractAllPagesToZip(file);
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    return {
      blob: zipBlob,
      filename: `${baseName}_split_pages.zip`,
      pageCount: totalPages,
    };
  }

  // Parse custom range (1-indexed input like "1-3, 5")
  const totalPages = await getPdfPageCount(file);
  const pageIndicesToKeep: number[] = [];
  const parts = pageRangeStr.split(',').map((s) => s.trim());

  for (const part of parts) {
    if (!part) continue;
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map((s) => s.trim());
      const start = Math.max(1, parseInt(startStr, 10));
      const end = Math.min(totalPages, parseInt(endStr, 10));
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let i = start; i <= end; i++) {
          if (!pageIndicesToKeep.includes(i)) {
            pageIndicesToKeep.push(i);
          }
        }
      }
    } else {
      const pageNum = parseInt(part, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        if (!pageIndicesToKeep.includes(pageNum)) {
          pageIndicesToKeep.push(pageNum);
        }
      }
    }
  }

  if (pageIndicesToKeep.length === 0) {
    throw new Error(`Invalid page range. The document contains ${totalPages} pages.`);
  }

  pageIndicesToKeep.sort((a, b) => a - b);
  const blob = await extractPdfPages(file, pageIndicesToKeep);
  const baseName = file.name.replace(/\.[^/.]+$/, '');

  return {
    blob,
    filename: `${baseName}_extracted.pdf`,
    pageCount: pageIndicesToKeep.length,
  };
}

/**
 * PDF Compressor: Uses PDF structure stream compaction, deduplication, and metadata strip.
 */
export async function compressPdfFile(
  file: File
): Promise<{ blob: Blob; originalSize: number; finalSize: number; savedBytes: number; savedPercent: number }> {
  const originalSize = file.size;
  const arrayBuffer = await file.arrayBuffer();

  const pdfDoc = await PDFDocument.load(arrayBuffer, {
    ignoreEncryption: true,
    updateMetadata: false,
  });

  // Strip non-essential metadata and write with compressed object streams
  pdfDoc.setTitle('');
  pdfDoc.setAuthor('');
  pdfDoc.setSubject('');
  pdfDoc.setKeywords([]);
  pdfDoc.setProducer('Smart Tools PDF Engine');
  pdfDoc.setCreator('Smart Tools');

  const compressedBytes = await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
    objectsPerTick: 50,
  });

  const finalBlob = new Blob([compressedBytes], { type: 'application/pdf' });
  const finalSize = finalBlob.size;
  const savedBytes = Math.max(0, originalSize - finalSize);
  const savedPercent = originalSize > 0 ? Math.round((savedBytes / originalSize) * 100) : 0;

  return {
    blob: finalBlob,
    originalSize,
    finalSize,
    savedBytes,
    savedPercent,
  };
}

/**
 * JPG to PDF: Converts one or more images (JPG/PNG) into a single unified PDF.
 */
export async function convertImagesToPdf(
  files: File[],
  pageSize: 'fit' | 'a4_portrait' | 'a4_landscape' = 'fit',
  margin: number = 20
): Promise<Blob> {
  if (files.length === 0) {
    throw new Error('Please select at least one image file.');
  }

  const pdfDoc = await PDFDocument.create();

  // Standard A4 dimensions in points (72 points/inch)
  const A4_WIDTH = 595.28;
  const A4_HEIGHT = 841.89;

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    let image;
    if (file.type === 'image/png') {
      image = await pdfDoc.embedPng(arrayBuffer);
    } else {
      image = await pdfDoc.embedJpg(arrayBuffer);
    }

    const { width: imgW, height: imgH } = image;

    if (pageSize === 'fit') {
      const page = pdfDoc.addPage([imgW, imgH]);
      page.drawImage(image, { x: 0, y: 0, width: imgW, height: imgH });
    } else {
      const isPortrait = pageSize === 'a4_portrait';
      const pageW = isPortrait ? A4_WIDTH : A4_HEIGHT;
      const pageH = isPortrait ? A4_HEIGHT : A4_WIDTH;
      const page = pdfDoc.addPage([pageW, pageH]);

      // Contained fit inside specified margin
      const safeMargin = Math.max(0, margin);
      const availW = pageW - safeMargin * 2;
      const availH = pageH - safeMargin * 2;
      const scale = Math.min(availW / imgW, availH / imgH, 1.0);
      const drawW = imgW * scale;
      const drawH = imgH * scale;
      const posX = safeMargin + (availW - drawW) / 2;
      const posY = safeMargin + (availH - drawH) / 2;

      page.drawImage(image, {
        x: posX,
        y: posY,
        width: drawW,
        height: drawH,
      });
    }
  }

  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

/**
 * PDF to JPG: Renders pages of a PDF document to high-resolution JPEG images.
 */
export async function renderPdfPagesToImages(
  file: File,
  scale: number = 1.5,
  onProgress?: (current: number, total: number) => void
): Promise<{ pageNum: number; blob: Blob; dataUrl: string }[]> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const images: { pageNum: number; blob: Blob; dataUrl: string }[] = [];

  for (let i = 1; i <= numPages; i++) {
    if (onProgress) onProgress(i, numPages);
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: scale || 1.5 });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d')!;

    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };
    await page.render(renderContext as any).promise;

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b || new Blob()), 'image/jpeg', 0.92);
    });

    const dataUrl = URL.createObjectURL(blob);
    images.push({ pageNum: i, blob, dataUrl });
  }

  return images;
}

export const convertPdfToJpg = renderPdfPagesToImages;
