export interface CompressionResult {
  blob: Blob;
  dataUrl: string;
  originalSize: number;
  finalSize: number;
  originalWidth: number;
  originalHeight: number;
  finalWidth: number;
  finalHeight: number;
  quality: number;
  format: string;
  targetSize?: number;
  achievedTarget: boolean;
  savedBytes: number;
  savedPercent: number;
  iterations: number;
  message?: string;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

/**
 * Loads an image file into an HTMLImageElement safely in memory.
 */
export function loadImageFromFile(file: File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to decode image file. Please ensure it is a valid image format.'));
    };
    img.src = url;
  });
}

/**
 * Iterative binary-search quality and dimension reduction to strictly target <= targetBytes.
 */
export async function compressImageToTarget(
  file: File,
  targetBytes: number,
  outputFormat: 'image/jpeg' | 'image/webp' | 'image/png' = 'image/jpeg'
): Promise<CompressionResult> {
  const originalSize = file.size;
  const img = await loadImageFromFile(file);
  const originalWidth = img.naturalWidth || img.width;
  const originalHeight = img.naturalHeight || img.height;

  // If already below target size, perform light optimization
  if (originalSize <= targetBytes) {
    const canvas = document.createElement('canvas');
    canvas.width = originalWidth;
    canvas.height = originalHeight;
    const ctx = canvas.getContext('2d')!;
    if (outputFormat === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, originalWidth, originalHeight);
    }
    ctx.drawImage(img, 0, 0);

    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b || new Blob()), outputFormat, 0.92)
    );
    const dataUrl = URL.createObjectURL(blob);
    const finalSize = blob.size;

    return {
      blob,
      dataUrl,
      originalSize,
      finalSize,
      originalWidth,
      originalHeight,
      finalWidth: originalWidth,
      finalHeight: originalHeight,
      quality: 0.92,
      format: outputFormat,
      targetSize: targetBytes,
      achievedTarget: finalSize <= targetBytes,
      savedBytes: Math.max(0, originalSize - finalSize),
      savedPercent: Math.max(0, Math.round(((originalSize - finalSize) / originalSize) * 100)),
      iterations: 1,
      message: 'Original file was already under or near target size.',
    };
  }

  // Iterative dimensional and quality scaling loop
  let scale = 1.0;
  let bestBlob: Blob | null = null;
  let bestQuality = 0.85;
  let bestWidth = originalWidth;
  let bestHeight = originalHeight;
  let iterations = 0;
  const maxLoops = 15;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

  while (iterations < maxLoops) {
    iterations++;
    const currentWidth = Math.max(32, Math.round(originalWidth * scale));
    const currentHeight = Math.max(32, Math.round(originalHeight * scale));

    canvas.width = currentWidth;
    canvas.height = currentHeight;
    ctx.clearRect(0, 0, currentWidth, currentHeight);

    if (outputFormat === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, currentWidth, currentHeight);
    }
    ctx.drawImage(img, 0, 0, currentWidth, currentHeight);

    // Binary search for quality at this scale
    let lowQ = 0.05;
    let highQ = 0.95;
    let localBestBlob: Blob | null = null;
    let localBestQ = lowQ;

    for (let qStep = 0; qStep < 5; qStep++) {
      const midQ = Number(((lowQ + highQ) / 2).toFixed(2));
      const testBlob = await new Promise<Blob>((res) =>
        canvas.toBlob((b) => res(b || new Blob()), outputFormat, midQ)
      );

      if (testBlob.size <= targetBytes) {
        localBestBlob = testBlob;
        localBestQ = midQ;
        lowQ = midQ; // try higher quality if still under target
      } else {
        highQ = midQ; // too big, lower quality
      }
    }

    if (localBestBlob && localBestBlob.size <= targetBytes) {
      bestBlob = localBestBlob;
      bestQuality = localBestQ;
      bestWidth = currentWidth;
      bestHeight = currentHeight;
      break; // Found acceptable compression!
    } else {
      // Even lowest tested quality is too big, reduce dimensions by 20%
      scale *= 0.8;
      // Keep track of the closest blob found so far
      const fallbackBlob = await new Promise<Blob>((res) =>
        canvas.toBlob((b) => res(b || new Blob()), outputFormat, 0.15)
      );
      if (!bestBlob || fallbackBlob.size < bestBlob.size) {
        bestBlob = fallbackBlob;
        bestQuality = 0.15;
        bestWidth = currentWidth;
        bestHeight = currentHeight;
      }
    }
  }

  const finalBlob = bestBlob || (await new Promise<Blob>((res) =>
    canvas.toBlob((b) => res(b || new Blob()), outputFormat, 0.5)
  ));
  const finalSize = finalBlob.size;
  const achievedTarget = finalSize <= targetBytes;
  const dataUrl = URL.createObjectURL(finalBlob);

  return {
    blob: finalBlob,
    dataUrl,
    originalSize,
    finalSize,
    originalWidth,
    originalHeight,
    finalWidth: bestWidth,
    finalHeight: bestHeight,
    quality: bestQuality,
    format: outputFormat,
    targetSize: targetBytes,
    achievedTarget,
    savedBytes: Math.max(0, originalSize - finalSize),
    savedPercent: Math.max(0, Math.round(((originalSize - finalSize) / originalSize) * 100)),
    iterations,
    message: achievedTarget
      ? `Successfully compressed to under ${formatFileSize(targetBytes)}.`
      : `Reached practical browser compression limit of ${formatFileSize(finalSize)}.`,
  };
}

/**
 * Standard manual image compression with explicit quality (0.01 to 1.0) and dimensions.
 */
export async function compressImageManual(
  file: File,
  quality: number,
  outputFormat: 'image/jpeg' | 'image/webp' | 'image/png' = 'image/jpeg',
  scale: number = 1.0
): Promise<CompressionResult> {
  const originalSize = file.size;
  const img = await loadImageFromFile(file);
  const originalWidth = img.naturalWidth || img.width;
  const originalHeight = img.naturalHeight || img.height;

  const finalWidth = Math.max(16, Math.round(originalWidth * scale));
  const finalHeight = Math.max(16, Math.round(originalHeight * scale));

  const canvas = document.createElement('canvas');
  canvas.width = finalWidth;
  canvas.height = finalHeight;
  const ctx = canvas.getContext('2d')!;

  if (outputFormat === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, finalWidth, finalHeight);
  }
  ctx.drawImage(img, 0, 0, finalWidth, finalHeight);

  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b || new Blob()), outputFormat, quality)
  );
  const dataUrl = URL.createObjectURL(blob);
  const finalSize = blob.size;

  return {
    blob,
    dataUrl,
    originalSize,
    finalSize,
    originalWidth,
    originalHeight,
    finalWidth,
    finalHeight,
    quality,
    format: outputFormat,
    achievedTarget: true,
    savedBytes: Math.max(0, originalSize - finalSize),
    savedPercent: Math.max(0, Math.round(((originalSize - finalSize) / originalSize) * 100)),
    iterations: 1,
  };
}

/**
 * Resize image to exact width and height with optional background fill for transparent images.
 */
export async function resizeImageFile(
  file: File,
  width: number,
  height: number,
  format: string = 'image/png',
  quality: number = 0.92
): Promise<Blob> {
  const img = await loadImageFromFile(file);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  if (format === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
  }
  ctx.drawImage(img, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Failed to generate resized image'));
      },
      format,
      quality
    );
  });
}

/**
 * Format converter with transparent background color control (e.g. PNG to JPG with solid white).
 */
export async function convertImageFile(
  file: File,
  targetFormat: 'image/png' | 'image/jpeg' | 'image/webp',
  bgColor: string = '#FFFFFF',
  quality: number = 0.92
): Promise<Blob> {
  const img = await loadImageFromFile(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  const ctx = canvas.getContext('2d')!;

  if (targetFormat === 'image/jpeg' || bgColor !== 'transparent') {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(img, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Format conversion failed'));
      },
      targetFormat,
      quality
    );
  });
}

/**
 * Crop image to exact rectangular coordinates.
 */
export async function cropImageFile(
  file: File,
  crop: { x: number; y: number; width: number; height: number },
  format: string = 'image/png'
): Promise<Blob> {
  const img = await loadImageFromFile(file);
  const canvas = document.createElement('canvas');
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d')!;

  if (format === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, crop.width, crop.height);
  }

  ctx.drawImage(
    img,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Cropping failed'));
      },
      format,
      0.95
    );
  });
}

/**
 * Rotate image (90, 180, 270) and flip horizontally / vertically.
 */
export async function rotateAndFlipImage(
  file: File,
  degrees: number,
  flipH: boolean,
  flipV: boolean,
  format: string = 'image/png'
): Promise<Blob> {
  const img = await loadImageFromFile(file);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  const rad = (degrees * Math.PI) / 180;
  const isSwap = degrees % 180 !== 0;
  const width = isSwap ? img.naturalHeight || img.height : img.naturalWidth || img.width;
  const height = isSwap ? img.naturalWidth || img.width : img.naturalHeight || img.height;

  canvas.width = width;
  canvas.height = height;

  if (format === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
  }

  ctx.translate(width / 2, height / 2);
  ctx.rotate(rad);
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
  ctx.drawImage(
    img,
    -(img.naturalWidth || img.width) / 2,
    -(img.naturalHeight || img.height) / 2
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Rotation failed'));
      },
      format,
      0.95
    );
  });
}

/**
 * Utility to trigger browser file download.
 */
export const rotateAndFlipImageFile = rotateAndFlipImage;

export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
