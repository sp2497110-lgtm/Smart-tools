import { ToolDefinition, ToolCategory } from '../types';

export const CATEGORIES: { id: ToolCategory; label: string; description: string; icon: string }[] = [
  {
    id: 'image',
    label: 'Image Tools',
    description: 'Compress, resize, convert, crop and rotate images directly in your browser.',
    icon: 'ImageIcon',
  },
  {
    id: 'pdf',
    label: 'PDF Tools',
    description: 'Merge, split, compress and convert PDF files locally with zero server uploads.',
    icon: 'FileText',
  },
  {
    id: 'text',
    label: 'Text Tools',
    description: 'Count words, analyze reading time, convert case and clean duplicate lines.',
    icon: 'Type',
  },
  {
    id: 'dev',
    label: 'Developer Tools',
    description: 'Format, validate and minify JSON, encode/decode Base64 and URL parameters.',
    icon: 'Code',
  },
  {
    id: 'calc',
    label: 'Calculator Tools',
    description: 'Accurate financial, health and mathematical calculators with step-by-step formulas.',
    icon: 'Calculator',
  },
  {
    id: 'seo',
    label: 'SEO Tools',
    description: 'Generate production-ready meta tags, robots.txt directives and XML sitemaps.',
    icon: 'Search',
  },
  {
    id: 'qr',
    label: 'QR Code Tools',
    description: 'Generate customizable, high-resolution QR codes for URLs, WiFi, WhatsApp and contacts.',
    icon: 'QrCode',
  },
  {
    id: 'converter',
    label: 'Converter Tools',
    description: 'Lossless browser-based image and timestamp conversions without quality degradation.',
    icon: 'RefreshCw',
  },
  {
    id: 'utility',
    label: 'Utility Tools',
    description: 'Pick colors with hex/rgb, generate secure UUIDs and convert Unix timestamps.',
    icon: 'Wrench',
  },
];

export const TOOLS: ToolDefinition[] = [
  // ---------------- IMAGE TOOLS ----------------
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    path: '/tools/image-compressor.html',
    category: 'image',
    description: 'Compress JPG, PNG, and WebP images to your custom target size or quality with instant browser preview.',
    metaDescription: 'Free online image compressor to reduce JPG, PNG, and WebP file size. Compress images online in your browser without uploading files to a server.',
    iconName: 'Minimize2',
    popular: true,
    keywords: ['compress image', 'reduce image size', 'image optimizer', 'jpg compressor', 'png compressor', 'webp optimizer', 'target kb'],
    relatedToolIds: ['compress-image-to-50kb', 'compress-image-to-200kb', 'image-resizer', 'jpg-to-png', 'png-to-jpg'],
    seo: {
      h1: 'Free Online Image Compressor',
      intro: 'Optimize your JPG, PNG, and WebP images directly in your browser without compromising visual clarity. Files are processed locally on your device with complete privacy.',
      howToUse: [
        'Drag and drop or click to choose an image file (JPG, PNG, WebP).',
        'Choose a preset target size (50 KB, 100 KB, 200 KB) or adjust the quality slider.',
        'View real-time comparison between original and compressed output file size.',
        'Click "Download Compressed Image" to save the optimized file instantly.',
      ],
      features: [
        'Iterative binary-search quality and dimension reduction to hit exact target sizes.',
        'Supports JPG, PNG, and WebP image formats.',
        '100% private browser-based processing — images never touch a remote server.',
        'Displays original vs output file size, dimensions, and compression ratio.',
      ],
      faq: [
        {
          q: 'Are my images uploaded to your servers?',
          a: 'No. All compression is executed entirely on your device using HTML5 Canvas and browser WebAssembly APIs. Your files never leave your computer or phone.',
        },
        {
          q: 'How does target size compression work?',
          a: 'Our algorithm performs iterative binary-search adjustments on encoding quality and, if needed, scales dimensions down until the file strictly meets or falls below your specified target bytes.',
        },
        {
          q: 'Will compressing an image reduce its visual quality?',
          a: 'Smart Tools balances visual fidelity against file size, removing imperceptible metadata and using intelligent compression curves to preserve sharp details.',
        },
      ],
    },
  },
  {
    id: 'compress-image-to-20kb',
    name: 'Compress Image to 20 KB',
    path: '/tools/compress-image-to-20kb.html',
    category: 'image',
    targetKb: 20,
    description: 'Strictly compress any image to under 20 KB for online government portals, exams, and profile photo uploads.',
    metaDescription: 'Compress image to 20 KB online for free. Reduce JPG and PNG photo size for forms, applications, exams, and uploads with private browser-based processing.',
    iconName: 'FileDown',
    keywords: ['compress image to 20kb', '20kb photo converter', 'online photo under 20kb', 'reduce photo to 20kb'],
    relatedToolIds: ['image-compressor', 'compress-image-to-50kb', 'compress-image-to-100kb', 'image-resizer'],
    seo: {
      h1: 'Compress Image to 20 KB Online',
      intro: 'Many job applications, university admission portals, and official submission forms strictly enforce a maximum 20 KB file limit. Our specialized algorithm optimizes quality and resolution to meet this 20 KB ceiling.',
      howToUse: [
        'Select your photo or signature image.',
        'The tool automatically runs iterative compression to achieve under 20,480 bytes.',
        'Check the verified output file size and resolution.',
        'Download your ready-to-submit 20 KB photo.',
      ],
      features: [
        'Guarantees output size <= 20 KB without guessing.',
        'Maintains aspect ratio and facial legibility.',
        'Instant verification showing exact byte counts.',
        'Client-side execution ensures your identity documents remain confidential.',
      ],
      faq: [
        {
          q: 'Why do job and exam portals require images under 20 KB?',
          a: 'Large-scale government and university databases restrict file sizes to optimize storage and ensure quick form submission over low-bandwidth mobile connections.',
        },
        {
          q: 'What if my original image is 5 MB?',
          a: 'The algorithm automatically reduces resolution proportionally until the 20 KB constraint is satisfied.',
        },
      ],
    },
  },
  {
    id: 'compress-image-to-50kb',
    name: 'Compress Image to 50 KB',
    path: '/tools/compress-image-to-50kb.html',
    category: 'image',
    targetKb: 50,
    popular: true,
    description: 'Compress JPG and PNG images to under 50 KB with optimized clarity for web forms, passports, and IDs.',
    metaDescription: 'Compress image to 50 KB online for free. Reduce photo size for exam forms, applications, passports, and website uploads in your browser.',
    iconName: 'FileDown',
    keywords: ['compress image to 50kb', 'photo 50kb online', 'reduce image size to 50 kb', '50kb image converter'],
    relatedToolIds: ['image-compressor', 'compress-image-to-20kb', 'compress-image-to-100kb', 'compress-image-to-200kb'],
    seo: {
      h1: 'Compress Image to 50 KB Online',
      intro: 'Quickly shrink photos to under 50 KB for online portals, exam registrations, and official documents. Our engine tests multiple quality and dimension levels to land precisely below 50 KB.',
      howToUse: [
        'Upload your image from computer or mobile.',
        'The engine calculates and reaches under 51,200 bytes automatically.',
        'Inspect the compressed preview and verified size stats.',
        'Download your optimized file immediately.',
      ],
      features: [
        'Direct 50 KB target preset with iterative verification.',
        'Real-time display of original vs final dimensions and byte count.',
        'No watermarks, no signups, and no uploads to external servers.',
      ],
      faq: [
        {
          q: 'Will the image be readable at 50 KB?',
          a: 'Yes. 50 KB is generally adequate for passport-sized headshots and signature scans when optimized with proper chroma subsampling.',
        },
      ],
    },
  },
  {
    id: 'compress-image-to-100kb',
    name: 'Compress Image to 100 KB',
    path: '/tools/compress-image-to-100kb.html',
    category: 'image',
    targetKb: 100,
    description: 'Compress image to 100 KB or less. Balanced file size reduction for fast web pages, emails, and forms.',
    metaDescription: 'Compress image to 100 KB online for free. Reduce JPG, PNG, and WebP photo size for forms, websites, email, and document uploads.',
    iconName: 'FileDown',
    keywords: ['compress image to 100kb', '100 kb image compressor', 'reduce photo size to 100kb'],
    relatedToolIds: ['image-compressor', 'compress-image-to-50kb', 'compress-image-to-200kb', 'image-resizer'],
    seo: {
      h1: 'Compress Image to 100 KB Online',
      intro: '100 KB is the sweet spot for web graphics, blog thumbnails, and email attachments, providing crisp clarity while loading almost instantaneously.',
      howToUse: [
        'Select or drag your image file.',
        'The automated compression engine tunes the quality to stay under 100 KB.',
        'Review the before-and-after comparison.',
        'Download the optimized file.',
      ],
      features: [
        'Target under 102,400 bytes with sharp text and contours.',
        'Lossless metadata stripping to minimize file bloat.',
        'Works on all modern desktop and mobile browsers.',
      ],
      faq: [
        {
          q: 'Can I compress multiple formats to 100 KB?',
          a: 'Yes, our tool accepts JPG, PNG, and WebP, converting appropriately to maximize compression efficiency.',
        },
      ],
    },
  },
  {
    id: 'compress-image-to-200kb',
    name: 'Compress Image to 200 KB',
    path: '/tools/compress-image-to-200kb.html',
    category: 'image',
    targetKb: 200,
    popular: true,
    description: 'Compress image to 200 KB online. Ideal for high-definition social media posts, portfolios, and eCommerce stores.',
    metaDescription: 'Compress image to 200 KB online for free. Reduce photo file size while keeping good image quality for websites, forms, and uploads.',
    iconName: 'FileDown',
    keywords: ['compress image to 200kb', '200 kb compressor', 'reduce image under 200kb', 'photo compressor 200kb'],
    relatedToolIds: ['image-compressor', 'compress-image-to-100kb', 'compress-image-to-500kb', 'image-resizer'],
    seo: {
      h1: 'Compress Image to 200 KB Online',
      intro: 'When you need to preserve vibrant colors and high detail while strictly adhering to a 200 KB upload limit, this tool optimizes compression coefficients to deliver top quality.',
      howToUse: [
        'Select your high-resolution photograph or graphic.',
        'The tool iteratively refines encoding to remain under 204,800 bytes.',
        'Verify dimensions and final byte size.',
        'Save the resulting image to your device.',
      ],
      features: [
        'Preserves high definition while meeting the 200 KB boundary.',
        'Instant client-side rendering with zero latency.',
        'Detailed compression audit showing bytes saved and percentage reduction.',
      ],
      faq: [
        {
          q: 'Is 200 KB sufficient for full-width banners?',
          a: 'Yes, with modern WebP or optimized JPEG encoding, a 200 KB file can look virtually indistinguishable from the multi-megabyte original.',
        },
      ],
    },
  },
  {
    id: 'compress-image-to-500kb',
    name: 'Compress Image to 500 KB',
    path: '/tools/compress-image-to-500kb.html',
    category: 'image',
    targetKb: 500,
    description: 'Compress high-resolution DSLR photos and scans to under 500 KB without noticeable degradation.',
    metaDescription: 'Compress image to 500 KB online for free. Reduce large photos and scans to under 500 KB with private browser-based compression.',
    iconName: 'FileDown',
    keywords: ['compress image to 500kb', '500kb photo converter', 'reduce photo under 500kb'],
    relatedToolIds: ['image-compressor', 'compress-image-to-200kb', 'image-resizer', 'jpg-to-webp'],
    seo: {
      h1: 'Compress Image to 500 KB Online',
      intro: 'Take heavy multi-megabyte RAW camera exports or scans and safely compress them to under 500 KB, perfect for slide decks, PDF embeds, and responsive sites.',
      howToUse: [
        'Upload your large image file.',
        'The algorithm tests compression stages until the file is <= 512,000 bytes.',
        'Inspect the output preview.',
        'Download your 500 KB optimized image.',
      ],
      features: [
        'Heavy image reduction down to 500 KB.',
        'Browser-only pipeline protects private photographs.',
        'Works with modern JPEG, WebP, and PNG inputs.',
      ],
      faq: [
        {
          q: 'Can I upload files larger than 10MB?',
          a: 'Yes! Because processing occurs inside your browser memory, large files are processed locally without network timeout issues.',
        },
      ],
    },
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    path: '/tools/image-resizer.html',
    category: 'image',
    popular: true,
    description: 'Resize images by width, height, percentage, or social media presets with aspect ratio lock.',
    metaDescription: 'Free online image resizer to change photo dimensions in pixels or percentage. Resize JPG, PNG, and WebP images while preserving aspect ratio.',
    iconName: 'Scaling',
    keywords: ['image resizer', 'resize image online', 'change image dimensions', 'scale photo', 'aspect ratio resize'],
    relatedToolIds: ['image-compressor', 'image-cropper', 'image-rotator', 'jpg-to-png'],
    seo: {
      h1: 'Free Online Image Resizer',
      intro: 'Resize any image to precise pixel dimensions or scale by percentage. Maintain exact aspect ratio or unlock free dimensions for customized canvas sizes.',
      howToUse: [
        'Upload your image.',
        'Enter target width or height (aspect ratio is preserved automatically).',
        'Alternatively, pick a percentage scale (25%, 50%, 75%, 200%) or standard preset.',
        'Click "Resize & Download" to get your resized image.',
      ],
      features: [
        'Aspect ratio lock with automatic dimension recalculation.',
        'Popular presets: Instagram Square (1080x1080), Full HD (1920x1080), Icon (512x512).',
        'Bi-cubic canvas resampling for sharp edges and smooth gradients.',
        'No upload delays; runs locally in your browser.',
      ],
      faq: [
        {
          q: 'Does resizing reduce image file size?',
          a: 'Yes. Downscaling pixel dimensions significantly reduces the overall number of pixels, yielding a substantially smaller file.',
        },
      ],
    },
  },
  {
    id: 'jpg-to-png',
    name: 'JPG to PNG Converter',
    path: '/tools/jpg-to-png.html',
    category: 'converter',
    description: 'Convert JPG / JPEG images to lossless PNG format in your browser.',
    metaDescription: 'Convert JPG to PNG online for free. Change JPEG images to PNG format with fast, private browser-based conversion.',
    iconName: 'ArrowRightLeft',
    sourceFormat: 'jpg',
    targetFormat: 'png',
    keywords: ['jpg to png', 'jpeg to png converter', 'convert photo to png', 'lossless png conversion'],
    relatedToolIds: ['png-to-jpg', 'jpg-to-webp', 'image-compressor', 'image-resizer'],
    seo: {
      h1: 'Convert JPG to PNG Online',
      intro: 'Transform standard JPEG images into high-fidelity PNG format with lossless compression, suitable for design mockups, presentations, and editing software.',
      howToUse: [
        'Select or drag your JPG/JPEG file into the converter.',
        'Preview the image on the canvas.',
        'Click "Convert to PNG" to generate the lossless file.',
        'Download your new PNG image.',
      ],
      features: [
        'Lossless PNG encoding retaining every pixel value.',
        'Immediate browser conversion with zero server latency.',
        'Preserves original color profile and dimensions.',
      ],
      faq: [
        {
          q: 'Will converting JPG to PNG add a transparent background?',
          a: 'No. Since JPG does not support alpha transparency, converting to PNG preserves the original background colors intact.',
        },
      ],
    },
  },
  {
    id: 'png-to-jpg',
    name: 'PNG to JPG Converter',
    path: '/tools/png-to-jpg.html',
    category: 'converter',
    description: 'Convert PNG images to JPG with custom background color control for transparent areas.',
    metaDescription: 'Convert PNG to JPG online for free. Choose a background color for transparent areas and download an optimized JPEG image.',
    iconName: 'ArrowRightLeft',
    sourceFormat: 'png',
    targetFormat: 'jpg',
    keywords: ['png to jpg', 'png to jpeg converter', 'convert png to jpg', 'transparent png to jpg background'],
    relatedToolIds: ['jpg-to-png', 'webp-to-jpg', 'image-compressor', 'image-resizer'],
    seo: {
      h1: 'Convert PNG to JPG Online',
      intro: 'Convert transparent or heavy PNG files to standard JPG images. Choose your preferred background fill color (white, black, or custom) to prevent transparent areas from turning black.',
      howToUse: [
        'Upload your PNG file.',
        'Select the background color fill for transparent areas (default is clean white).',
        'Set the desired JPG export quality slider.',
        'Download your optimized JPG file.',
      ],
      features: [
        'Handles PNG transparency smoothly with background color fill.',
        'Adjustable output quality to balance clarity and file weight.',
        'Zero server uploads — 100% private.',
      ],
      faq: [
        {
          q: 'Why do transparent PNGs turn black when converted without this tool?',
          a: 'JPEG lacks an alpha transparency channel. Default converters fill empty alpha with RGB (0,0,0) black. Our tool properly fills transparency with your chosen background color.',
        },
      ],
    },
  },
  {
    id: 'jpg-to-webp',
    name: 'JPG to WebP Converter',
    path: '/tools/jpg-to-webp.html',
    category: 'converter',
    description: 'Convert JPG to modern WebP format for 30%+ smaller file sizes and faster website loading.',
    metaDescription: 'Convert JPG to WebP online for free. Create smaller, web-friendly WebP images for faster website loading and better performance.',
    iconName: 'Zap',
    sourceFormat: 'jpg',
    targetFormat: 'webp',
    keywords: ['jpg to webp', 'convert jpeg to webp', 'next gen image format', 'webp converter online'],
    relatedToolIds: ['webp-to-jpg', 'jpg-to-png', 'image-compressor'],
    seo: {
      h1: 'Convert JPG to WebP Online',
      intro: 'Upgrade your images to Google’s modern WebP format. WebP delivers superior lossy and lossless compression compared to JPEG, reducing page load times and boosting Google Core Web Vitals.',
      howToUse: [
        'Upload your JPG or JPEG image.',
        'Adjust the WebP compression quality slider if desired.',
        'Click "Convert to WebP".',
        'Download the lightweight WebP image.',
      ],
      features: [
        'Up to 35% smaller file sizes than comparable JPEGs at identical visual quality.',
        'Fully supported across modern web browsers.',
        'Instant browser-level encoding.',
      ],
      faq: [
        {
          q: 'Why is WebP better than JPG for websites?',
          a: 'WebP uses advanced predictive block encoding, resulting in smaller file sizes that load faster and save mobile bandwidth.',
        },
      ],
    },
  },
  {
    id: 'webp-to-jpg',
    name: 'WebP to JPG Converter',
    path: '/tools/webp-to-jpg.html',
    category: 'converter',
    description: 'Convert WebP images to universally compatible JPG files for older editors and devices.',
    metaDescription: 'Convert WebP to JPG online for free. Turn WebP images into widely compatible JPEG files for editing, sharing, and uploads.',
    iconName: 'ArrowRightLeft',
    sourceFormat: 'webp',
    targetFormat: 'jpg',
    keywords: ['webp to jpg', 'convert webp to jpeg', 'webp file to jpg', 'make webp compatible'],
    relatedToolIds: ['jpg-to-webp', 'png-to-jpg', 'image-compressor'],
    seo: {
      h1: 'Convert WebP to JPG Online',
      intro: 'Convert downloaded WebP images into standard JPG files compatible with older photo editors, legacy operating systems, and email clients.',
      howToUse: [
        'Upload your WebP file.',
        'Set output quality.',
        'Click "Convert to JPG".',
        'Download the converted JPEG image.',
      ],
      features: [
        'Universal compatibility across all software and platforms.',
        'High-fidelity canvas decoding.',
        'Fast and private in-browser operation.',
      ],
      faq: [
        {
          q: 'Why do some photo editors fail to open WebP files?',
          a: 'Some older desktop photo editors do not include native WebP decoders. Converting to JPG solves compatibility issues instantly.',
        },
      ],
    },
  },
  {
    id: 'image-cropper',
    name: 'Image Cropper',
    path: '/tools/image-cropper.html',
    category: 'image',
    description: 'Crop images with precision presets (1:1, 4:3, 16:9, free crop) and download in full resolution.',
    metaDescription: 'Free online image cropper. Crop photos to 1:1, 4:3, 16:9, or custom dimensions directly in your browser.',
    iconName: 'Crop',
    keywords: ['crop image', 'image cropper online', 'crop photo 1:1', 'aspect ratio crop', 'photo trimmer'],
    relatedToolIds: ['image-resizer', 'image-rotator', 'image-compressor'],
    seo: {
      h1: 'Free Online Image Cropper',
      intro: 'Crop unwanted areas from your photos with interactive aspect ratio presets including Square 1:1, Landscape 16:9, Standard 4:3, or Free Crop.',
      howToUse: [
        'Upload your image.',
        'Choose an aspect ratio preset or adjust the crop boundaries manually.',
        'Click "Crop Image" to preview the isolated section.',
        'Download the cropped result.',
      ],
      features: [
        'Presets: Free Crop, 1:1 (Avatar/Instagram), 4:3 (Standard), 16:9 (Widescreen).',
        'Real-time crop coordinates and dimension readout.',
        'Retains original source resolution without downscaling.',
      ],
      faq: [
        {
          q: 'Does cropping reduce photo clarity?',
          a: 'No. Cropping extracts the exact native pixels from within your selected bounding box without altering pixel resolution.',
        },
      ],
    },
  },
  {
    id: 'image-rotator',
    name: 'Image Rotator & Flipper',
    path: '/tools/image-rotator.html',
    category: 'image',
    description: 'Rotate images 90°, 180°, 270° or flip horizontally and vertically with instant preview.',
    metaDescription: 'Rotate or flip images online for free. Turn photos 90, 180, or 270 degrees and flip them horizontally or vertically.',
    iconName: 'RotateCw',
    keywords: ['rotate image', 'image rotator', 'flip photo horizontal', 'flip photo vertical', 'fix upside down photo'],
    relatedToolIds: ['image-cropper', 'image-resizer', 'image-compressor'],
    seo: {
      h1: 'Rotate & Flip Images Online',
      intro: 'Fix sideways or upside-down smartphone photos in seconds. Rotate clockwise or counterclockwise by 90-degree increments or create mirror reflections with horizontal and vertical flipping.',
      howToUse: [
        'Select or drag your image into the tool.',
        'Click Rotate 90°, Rotate 180°, Flip Horizontal, or Flip Vertical.',
        'Preview the transformed canvas orientation.',
        'Click "Download Rotated Image".',
      ],
      features: [
        'Rotates by 90°, 180°, and 270° clockwise.',
        'Mirror flip horizontally and vertically.',
        'Updates canvas dimensions to preserve every corner without clipping.',
      ],
      faq: [
        {
          q: 'Why do smartphone photos sometimes open sideways?',
          a: 'Smartphones store orientation flags in EXIF metadata. Our rotator applies physical canvas pixel transformation so the photo opens correctly everywhere.',
        },
      ],
    },
  },

  // ---------------- PDF TOOLS ----------------
  {
    id: 'pdf-compressor',
    name: 'PDF Compressor',
    path: '/tools/pdf-compressor.html',
    category: 'pdf',
    popular: true,
    description: 'Compress PDF documents in your browser by compacting object streams and stripping redundant metadata.',
    metaDescription: 'Compress PDF online for free. Reduce PDF file size directly in your browser without uploading your sensitive documents.',
    iconName: 'FileText',
    keywords: ['pdf compressor', 'compress pdf online', 'reduce pdf size', 'shrink pdf', 'private pdf compressor'],
    relatedToolIds: ['pdf-merger', 'pdf-splitter', 'jpg-to-pdf', 'pdf-to-jpg'],
    seo: {
      h1: 'Free Online PDF Compressor',
      intro: 'Reduce PDF file sizes safely inside your browser. By stripping non-essential metadata and compacting cross-reference object streams, our engine minimizes file weight while keeping documents 100% private.',
      howToUse: [
        'Select your PDF file from your device.',
        'The browser engine analyzes internal PDF streams and applies compression.',
        'Review original size, compressed size, and percentage saved.',
        'Download the optimized PDF document.',
      ],
      features: [
        '100% client-side execution — confidential contracts and tax papers never leave your device.',
        'Compacts PDF cross-reference tables and streams.',
        'Strips redundant printer metadata and application headers.',
      ],
      faq: [
        {
          q: 'Are my confidential documents safe?',
          a: 'Absolutely. Unlike most PDF services that upload your files to remote servers, Smart Tools uses client-side JavaScript (pdf-lib) directly inside your browser.',
        },
        {
          q: 'Will compression change the text or layout of my PDF?',
          a: 'No. All vector text, fonts, and layout structures remain intact.',
        },
      ],
    },
  },
  {
    id: 'pdf-merger',
    name: 'PDF Merger',
    path: '/tools/pdf-merger.html',
    category: 'pdf',
    popular: true,
    description: 'Combine multiple PDF files into a single unified document with drag-and-drop reordering.',
    metaDescription: 'Merge PDF files online for free. Combine multiple PDFs into one document easily and securely in your browser.',
    iconName: 'Layers',
    keywords: ['merge pdf', 'combine pdfs', 'pdf joiner online', 'merge documents into one pdf'],
    relatedToolIds: ['pdf-splitter', 'pdf-compressor', 'jpg-to-pdf'],
    seo: {
      h1: 'Merge PDF Files Online for Free',
      intro: 'Combine multiple PDF files into one clean, organized document. Reorder your files up or down, delete unwanted files, and generate a unified PDF in seconds.',
      howToUse: [
        'Select two or more PDF files or drag them into the upload box.',
        'Reorder documents using the Up/Down buttons to set the desired sequence.',
        'Click "Merge PDFs" to join all pages into a single file.',
        'Download the combined PDF document.',
      ],
      features: [
        'Merge unlimited pages from multiple PDF files.',
        'Drag or click to reorder documents prior to merging.',
        'Client-side engine ensures fast processing with no upload queue.',
      ],
      faq: [
        {
          q: 'Is there a limit on how many PDFs I can merge?',
          a: 'There is no artificial limit. Because processing uses your local browser memory, performance scales directly with your device capability.',
        },
      ],
    },
  },
  {
    id: 'pdf-splitter',
    name: 'PDF Splitter',
    path: '/tools/pdf-splitter.html',
    category: 'pdf',
    description: 'Extract specific pages or page ranges from a PDF document or save all pages as individual PDFs in a ZIP.',
    metaDescription: 'Split PDF online for free. Extract pages or split PDF into individual files safely in your browser.',
    iconName: 'Scissors',
    keywords: ['split pdf', 'extract pdf pages', 'separate pdf pages', 'cut pdf online'],
    relatedToolIds: ['pdf-merger', 'pdf-compressor', 'pdf-to-jpg'],
    seo: {
      h1: 'Split PDF Documents Online',
      intro: 'Extract selected pages from any PDF document or break a large file into individual single-page documents packaged into a convenient ZIP archive.',
      howToUse: [
        'Upload your PDF file to inspect the total page count.',
        'Enter a page range (e.g., "1-3, 5") or choose "Extract All Pages to ZIP".',
        'Click "Split PDF" to generate the extracted document.',
        'Download the result to your computer or phone.',
      ],
      features: [
        'Custom page range parser supporting ranges and comma lists.',
        'One-click extraction of every page into a neat ZIP archive.',
        'Zero uploads ensures full confidentiality for personal paperwork.',
      ],
      faq: [
        {
          q: 'How do I specify a page range?',
          a: 'Use hyphens for ranges and commas for individual pages. For example, "1-4, 7, 9-11" extracts pages 1, 2, 3, 4, 7, 9, 10, and 11.',
        },
      ],
    },
  },
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF Converter',
    path: '/tools/jpg-to-pdf.html',
    category: 'pdf',
    popular: true,
    description: 'Convert one or multiple JPG/PNG images into a clean, printable PDF document with custom page layouts.',
    metaDescription: 'Convert JPG to PDF online for free. Combine multiple images into a single printable PDF document.',
    iconName: 'FileImage',
    keywords: ['jpg to pdf', 'images to pdf converter', 'convert photos to pdf', 'png to pdf document'],
    relatedToolIds: ['pdf-to-jpg', 'pdf-merger', 'image-compressor'],
    seo: {
      h1: 'Convert JPG to PDF Online',
      intro: 'Convert photos, receipts, identity cards, or design assets into an organized PDF. Choose between Fit Image to Page, A4 Portrait, or A4 Landscape layouts.',
      howToUse: [
        'Upload one or multiple JPG or PNG images.',
        'Choose your page layout: Fit Image, A4 Portrait, or A4 Landscape.',
        'Reorder images if needed.',
        'Click "Convert to PDF" and download your document.',
      ],
      features: [
        'Combines multiple photos into a single multi-page PDF.',
        'Standard A4 paper presets with balanced print margins.',
        'Lossless image embedding preserves crisp text on scanned documents.',
      ],
      faq: [
        {
          q: 'Can I combine multiple pictures into one PDF?',
          a: 'Yes! Select multiple photos and they will be arranged in sequential pages within your output PDF.',
        },
      ],
    },
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG Converter',
    path: '/tools/pdf-to-jpg.html',
    category: 'pdf',
    description: 'Render and extract all pages of a PDF document as high-resolution JPEG images.',
    metaDescription: 'Convert PDF to JPG online for free. Extract PDF pages as high-resolution images directly in your browser.',
    iconName: 'Images',
    keywords: ['pdf to jpg', 'pdf to image converter', 'extract pages as jpg', 'convert pdf to jpeg'],
    relatedToolIds: ['jpg-to-pdf', 'pdf-splitter', 'image-compressor'],
    seo: {
      h1: 'Convert PDF to JPG Online',
      intro: 'Extract every page of a PDF document as high-resolution JPG images. Preview extracted pages in real-time and download individual pages or the entire document.',
      howToUse: [
        'Upload your PDF file.',
        'The browser renders each page in high resolution (2x scaling).',
        'Preview rendered page cards.',
        'Download individual page images or grab all images.',
      ],
      features: [
        'High-resolution 2x rendering for ultra-sharp typography.',
        'Preview every page thumbnail before downloading.',
        'Processed 100% locally via browser-compatible PDF rendering.',
      ],
      faq: [
        {
          q: 'Are the converted JPG images high quality?',
          a: 'Yes! Pages are rendered at 200% scale to ensure vector text and fine graphic details remain clear and legible.',
        },
      ],
    },
  },

  // ---------------- TEXT TOOLS ----------------
  {
    id: 'word-counter',
    name: 'Word & Character Counter',
    path: '/tools/word-counter.html',
    category: 'text',
    popular: true,
    description: 'Real-time word, character, sentence, paragraph, and reading time counter for writers and students.',
    metaDescription: 'Free online word counter. Count words, characters, sentences, paragraphs, and estimated reading time in real-time.',
    iconName: 'FileText',
    keywords: ['word counter', 'character counter', 'count words online', 'reading time calculator', 'sentence counter'],
    relatedToolIds: ['character-counter', 'case-converter', 'remove-duplicate-lines'],
    seo: {
      h1: 'Online Word & Character Counter',
      intro: 'Analyze any text in real-time. Calculate total words, characters (with and without spaces), sentences, paragraphs, average reading time, and speaking time.',
      howToUse: [
        'Type or paste your text into the editor box.',
        'Counters update live with every keystroke.',
        'Review comprehensive metrics including reading and speaking time estimates.',
        'Use the "Copy Text" button or "Clear" to reset.',
      ],
      features: [
        'Instant live statistics with zero lag.',
        'Counts words, characters with/without spaces, sentences, paragraphs.',
        'Estimates reading time at 200 WPM and speaking time at 130 WPM.',
      ],
      faq: [
        {
          q: 'How is reading time calculated?',
          a: 'Average adult reading speed is approximately 200 words per minute (WPM). Reading time equals total words divided by 200.',
        },
      ],
    },
  },
  {
    id: 'character-counter',
    name: 'Character Counter',
    path: '/tools/character-counter.html',
    category: 'text',
    description: 'Track character limits for social media, SEO meta descriptions, and SMS messages.',
    metaDescription: 'Free character counter with limits for Twitter/X (280 chars), SMS (160 chars), and SEO meta descriptions (160 chars).',
    iconName: 'Hash',
    keywords: ['character counter', 'letter counter', 'twitter character count', 'sms limit counter', 'seo meta length'],
    relatedToolIds: ['word-counter', 'case-converter', 'meta-tag-generator'],
    seo: {
      h1: 'Online Character Counter',
      intro: 'Monitor character counts against standard platform limits like Twitter / X posts (280 chars), SMS texts (160 chars), and Google Search meta descriptions (160 chars).',
      howToUse: [
        'Enter or paste your draft into the input field.',
        'Track remaining characters for social and search platforms via live progress meters.',
        'Copy your final draft with one click.',
      ],
      features: [
        'Pre-configured gauges for Twitter/X, SMS, and SEO Meta limits.',
        'Shows characters with spaces and without spaces.',
        'Clean, distraction-free interface.',
      ],
      faq: [
        {
          q: 'What is the ideal meta description length for Google?',
          a: 'Google generally truncates meta descriptions around 155–160 characters on desktop and 120 characters on mobile devices.',
        },
      ],
    },
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    path: '/tools/case-converter.html',
    category: 'text',
    popular: true,
    description: 'Convert text between UPPERCASE, lowercase, Title Case, Sentence case, Capitalized, camelCase, and snake_case.',
    metaDescription: 'Free online case converter. Switch text between UPPERCASE, lowercase, Title Case, sentence case, camelCase, and snake_case.',
    iconName: 'Type',
    keywords: ['case converter', 'uppercase to lowercase', 'title case converter', 'sentence case', 'camelcase converter'],
    relatedToolIds: ['word-counter', 'remove-duplicate-lines', 'json-formatter'],
    seo: {
      h1: 'Online Text Case Converter',
      intro: 'Instantly convert your text into UPPERCASE, lowercase, Title Case, Sentence case, Capitalized Words, camelCase, snake_case, or kebab-case with one click.',
      howToUse: [
        'Paste your text into the textarea.',
        'Click the button corresponding to your desired casing style.',
        'Click "Copy Result" to place the converted text onto your clipboard.',
      ],
      features: [
        'Supports 8 casing styles: UPPERCASE, lowercase, Title Case, Sentence case, Capitalized, camelCase, snake_case, kebab-case.',
        'Smart Title Case handles common English prepositions appropriately.',
        'Instant 1-click clipboard copy.',
      ],
      faq: [
        {
          q: 'What is the difference between Title Case and Capitalized Words?',
          a: 'Capitalized Words capitalizes every single word, whereas Title Case leaves minor articles and prepositions (like "in", "the", "and") in lowercase unless they start the sentence.',
        },
      ],
    },
  },
  {
    id: 'remove-duplicate-lines',
    name: 'Remove Duplicate Lines',
    path: '/tools/remove-duplicate-lines.html',
    category: 'text',
    description: 'Clean lists by removing duplicate lines while preserving original ordering and trimming whitespace.',
    metaDescription: 'Remove duplicate lines online for free. Deduplicate text lists, preserve original order, and trim whitespace easily.',
    iconName: 'Filter',
    keywords: ['remove duplicate lines', 'deduplicate list', 'delete duplicate text', 'clean list online', 'unique lines'],
    relatedToolIds: ['word-counter', 'case-converter', 'json-formatter'],
    seo: {
      h1: 'Remove Duplicate Lines from Text',
      intro: 'Clean up email lists, keywords, URLs, or code arrays. Eliminate duplicate lines while preserving your original line order, with optional case sensitivity and whitespace trimming.',
      howToUse: [
        'Paste your list of lines into the input area.',
        'Toggle "Trim Whitespace" or "Case Sensitive" options as needed.',
        'Click "Remove Duplicates".',
        'Review the count of removed duplicates and copy the cleaned list.',
      ],
      features: [
        'Preserves original line ordering.',
        'Optionally trims leading and trailing whitespace before comparison.',
        'Real-time stats showing original line count, duplicates removed, and final unique lines.',
      ],
      faq: [
        {
          q: 'Does this tool preserve the order of my lines?',
          a: 'Yes! The first occurrence of each unique line is kept in its exact original position.',
        },
      ],
    },
  },

  // ---------------- DEVELOPER TOOLS ----------------
  {
    id: 'json-formatter',
    name: 'JSON Formatter & Beautifier',
    path: '/tools/json-formatter.html',
    category: 'dev',
    popular: true,
    description: 'Format, beautify, and validate JSON code with custom indentation (2 spaces, 4 spaces, tabs).',
    metaDescription: 'Free online JSON formatter and beautifier. Indent and format raw JSON with custom spacing and syntax error detection.',
    iconName: 'Braces',
    keywords: ['json formatter', 'beautify json', 'format json online', 'json indent', 'pretty print json'],
    relatedToolIds: ['json-validator', 'json-minifier', 'base64-encoder', 'url-encoder'],
    seo: {
      h1: 'Online JSON Formatter & Beautifier',
      intro: 'Turn unformatted, minified JSON payloads into clean, readable code with customizable indentation. Features real-time syntax checking with precise line numbers on syntax errors.',
      howToUse: [
        'Paste unformatted JSON into the input editor.',
        'Select your indentation preference (2 spaces, 4 spaces, or Tab).',
        'Click "Format JSON" or view the live formatted output.',
        'Copy the beautified JSON or download it as a .json file.',
      ],
      features: [
        'Custom indentation: 2 spaces, 4 spaces, or Tab.',
        'Displays exact line and column location of parsing errors.',
        'Safe client-side JSON parsing — never executes eval() or external scripts.',
      ],
      faq: [
        {
          q: 'Is my JSON data secure?',
          a: 'Yes. The parsing is done strictly using browser native JSON.parse() in memory. No data is sent over the network.',
        },
      ],
    },
  },
  {
    id: 'json-validator',
    name: 'JSON Validator',
    path: '/tools/json-validator.html',
    category: 'dev',
    description: 'Validate JSON syntax and identify exact line and column errors in malformed data.',
    metaDescription: 'Validate JSON syntax online. Get clear error messages with exact line and character positions for invalid JSON.',
    iconName: 'CheckCircle2',
    keywords: ['json validator', 'validate json online', 'json lint', 'check json syntax', 'find json errors'],
    relatedToolIds: ['json-formatter', 'json-minifier', 'base64-encoder'],
    seo: {
      h1: 'Online JSON Validator',
      intro: 'Check whether your JSON payload is valid against the RFC 8259 specification. Pinpoint missing commas, trailing quotes, unclosed brackets, and syntax defects instantly.',
      howToUse: [
        'Paste your JSON payload into the validator.',
        'Click "Validate JSON".',
        'Receive an instant Valid badge or an error summary pinpointing the issue.',
      ],
      features: [
        'Detects syntax errors with character and line indicators.',
        'Displays JSON object key counts and data type hierarchy.',
        'Safe in-memory parsing without arbitrary code execution.',
      ],
      faq: [
        {
          q: 'What are the most common JSON syntax errors?',
          a: 'The most frequent errors are trailing commas after the last array/object item, single quotes instead of double quotes, and unescaped newlines in strings.',
        },
      ],
    },
  },
  {
    id: 'json-minifier',
    name: 'JSON Minifier',
    path: '/tools/json-minifier.html',
    category: 'dev',
    description: 'Compress and minify JSON by stripping whitespace and indentation to reduce payload transfer sizes.',
    metaDescription: 'Minify JSON online for free. Remove unnecessary whitespace, tabs, and newlines to shrink JSON payload size.',
    iconName: 'Minimize',
    keywords: ['json minifier', 'compress json', 'minify json online', 'shrink json payload', 'json compact'],
    relatedToolIds: ['json-formatter', 'json-validator', 'base64-encoder'],
    seo: {
      h1: 'Online JSON Minifier',
      intro: 'Remove all unnecessary whitespace, spaces, newlines, and indentation from your JSON payloads to optimize API responses and minimize network bandwidth.',
      howToUse: [
        'Paste your formatted JSON code into the editor.',
        'Click "Minify JSON".',
        'Inspect the byte size reduction statistics.',
        'Copy or download the single-line minified JSON string.',
      ],
      features: [
        'Eliminates all excess whitespace without corrupting string content.',
        'Calculates exact byte savings and percentage reduction.',
        '1-click copy to clipboard.',
      ],
      faq: [
        {
          q: 'Will minifying JSON break my data?',
          a: 'No. Minification strictly removes non-semantic whitespace outside of string literals, keeping data structure 100% equivalent.',
        },
      ],
    },
  },
  {
    id: 'base64-encoder',
    name: 'Base64 Encoder',
    path: '/tools/base64-encoder.html',
    category: 'dev',
    popular: true,
    description: 'Encode UTF-8 text or binary files into Base64 format for safe data transmission.',
    metaDescription: 'Free online Base64 encoder. Convert text and files to standard Base64 encoding with UTF-8 support in your browser.',
    iconName: 'Binary',
    keywords: ['base64 encoder', 'encode base64 online', 'text to base64', 'file to base64', 'base64 converter'],
    relatedToolIds: ['base64-decoder', 'url-encoder', 'json-formatter'],
    seo: {
      h1: 'Online Base64 Encoder',
      intro: 'Convert plain text, symbols, international UTF-8 characters, or files into standard Base64 format for embedding in HTML, CSS, JSON payloads, or HTTP headers.',
      howToUse: [
        'Type or paste text into the input field, or choose a file.',
        'The tool converts your input into Base64 text in real-time.',
        'Click "Copy Result" to use in your application.',
      ],
      features: [
        'Full UTF-8 support for emoji, non-Latin alphabets, and symbols.',
        'File-to-Base64 conversion with Data URL prefix.',
        'Client-side processing guarantees data privacy.',
      ],
      faq: [
        {
          q: 'What is Base64 encoding used for?',
          a: 'Base64 represents binary data in an ASCII string format, allowing images and binary payloads to be transmitted across media that only support text (such as email, URLs, and JSON).',
        },
      ],
    },
  },
  {
    id: 'base64-decoder',
    name: 'Base64 Decoder',
    path: '/tools/base64-decoder.html',
    category: 'dev',
    description: 'Decode Base64 encoded strings back into readable text or preview embedded Base64 images.',
    metaDescription: 'Free online Base64 decoder. Convert Base64 strings back to UTF-8 plain text or preview encoded images directly in your browser.',
    iconName: 'Binary',
    keywords: ['base64 decoder', 'decode base64 online', 'base64 to text', 'base64 to image preview', 'base64 convert'],
    relatedToolIds: ['base64-encoder', 'url-decoder', 'json-validator'],
    seo: {
      h1: 'Online Base64 Decoder',
      intro: 'Transform Base64 encoded strings back into readable plain text or preview Base64 image data URLs directly in your browser.',
      howToUse: [
        'Paste your Base64 encoded string into the input box.',
        'The decoder parses the characters and outputs the original UTF-8 text.',
        'If the Base64 represents an image, preview the image immediately.',
        'Copy the decoded text with one click.',
      ],
      features: [
        'Safe UTF-8 decoding handling multi-byte international characters.',
        'Auto-detects image data URLs (JPEG, PNG, WebP, SVG) and provides an image preview.',
        'Clear error notifications for malformed Base64 strings.',
      ],
      faq: [
        {
          q: 'What causes "The string to be decoded is not correctly encoded" errors?',
          a: 'This happens when the string contains invalid characters not in the Base64 alphabet (A-Z, a-z, 0-9, +, /) or is missing required "=" padding.',
        },
      ],
    },
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder',
    path: '/tools/url-encoder.html',
    category: 'dev',
    description: 'Encode query parameters and URLs into percent-encoded format for safe web transmission.',
    metaDescription: 'Free online URL encoder. Convert special characters and query strings into safe percent-encoded URLs.',
    iconName: 'Link',
    keywords: ['url encoder', 'encode url online', 'percent encoding', 'url parameter encoder', 'encodeuricomponent'],
    relatedToolIds: ['url-decoder', 'base64-encoder', 'json-formatter'],
    seo: {
      h1: 'Online URL Encoder',
      intro: 'Convert reserved and special characters in URLs into standard percent-encoded format (RFC 3986) so they can be safely transmitted in query parameters and HTTP requests.',
      howToUse: [
        'Enter text or a URL query string.',
        'Choose between "Component Encoding" (encodeURIComponent) or "Full URL Encoding" (encodeURI).',
        'Copy the percent-encoded result.',
      ],
      features: [
        'Handles spaces, ampersands, question marks, slashes, and UTF-8 characters.',
        'Instant live encoding as you type.',
        'Single-click copy button.',
      ],
      faq: [
        {
          q: 'What is the difference between encodeURI and encodeURIComponent?',
          a: 'encodeURI preserves protocol and domain slashes (: / ? # & =), whereas encodeURIComponent escapes all punctuation characters, making it ideal for query parameter values.',
        },
      ],
    },
  },
  {
    id: 'url-decoder',
    name: 'URL Decoder',
    path: '/tools/url-decoder.html',
    category: 'dev',
    description: 'Decode percent-encoded URL strings back into human-readable text and query parameters.',
    metaDescription: 'Free online URL decoder. Convert percent-encoded URLs (%20, %26, etc.) back into readable text.',
    iconName: 'Link2',
    keywords: ['url decoder', 'decode url online', 'percent decode', 'decodeuricomponent', 'url string converter'],
    relatedToolIds: ['url-encoder', 'base64-decoder', 'json-formatter'],
    seo: {
      h1: 'Online URL Decoder',
      intro: 'Turn percent-encoded URLs and query parameters back into plain text. Replaces sequences like %20 with spaces and %26 with ampersands instantly.',
      howToUse: [
        'Paste your percent-encoded URL into the box.',
        'The tool parses the escape sequences into readable UTF-8 text.',
        'Click "Copy Decoded URL".',
      ],
      features: [
        'Decodes UTF-8 multi-byte characters and special symbols.',
        'Handles plus signs (+) as spaces option.',
        'Instant result with error detection for malformed sequences.',
      ],
      faq: [
        {
          q: 'Why do spaces appear as %20 or + in URLs?',
          a: '%20 is the standard percent-encoding for a space character according to RFC 3986. The plus sign (+) is commonly used in application/x-www-form-urlencoded form submissions.',
        },
      ],
    },
  },

  // ---------------- QR CODE TOOLS ----------------
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    path: '/tools/qr-code-generator.html',
    category: 'qr',
    popular: true,
    description: 'Generate high-resolution QR codes for websites, Wi-Fi networks, WhatsApp, phone numbers, and vCards.',
    metaDescription: 'Free online QR code generator. Create custom QR codes for URLs, WiFi, WhatsApp, email, and text with instant PNG download.',
    iconName: 'QrCode',
    keywords: ['qr code generator', 'create qr code online', 'wifi qr code', 'whatsapp qr code', 'free qr code maker'],
    relatedToolIds: ['color-picker', 'url-encoder', 'image-compressor'],
    seo: {
      h1: 'Free Online QR Code Generator',
      intro: 'Generate customizable, high-resolution QR codes for websites, Wi-Fi network credentials, WhatsApp chats, email addresses, phone calls, and plain text. Download directly as a high-res PNG.',
      howToUse: [
        'Select the QR code type: URL, Plain Text, Wi-Fi, WhatsApp, Phone, or Email.',
        'Fill in the corresponding information (e.g. WiFi SSID and Password, or URL).',
        'Customize foreground and background colors and size.',
        'Click "Download QR Code PNG" to save the image.',
      ],
      features: [
        'Supports URL, Wi-Fi (WPA/WPA2/WEP), WhatsApp direct message, Phone, Email, and Text.',
        'Customizable foreground and background colors.',
        'Adjustable error correction level (Low, Medium, Quartile, High).',
        '100% static & privacy-friendly — QR codes never expire and contain no redirection proxies.',
      ],
      faq: [
        {
          q: 'Do these QR codes expire?',
          a: 'No! These are static QR codes. The encoded data is stored directly in the pixel pattern, so they never expire and require no external server to function.',
        },
        {
          q: 'How does the Wi-Fi QR code work?',
          a: 'Scanning the Wi-Fi QR code with your smartphone camera prompts you to connect directly to the wireless network without manually typing the password.',
        },
      ],
    },
  },

  // ---------------- CALCULATOR TOOLS ----------------
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    path: '/tools/percentage-calculator.html',
    category: 'calc',
    popular: true,
    description: 'Calculate what is X% of Y, X is what % of Y, and percentage increase or decrease with step-by-step math.',
    metaDescription: 'Free online percentage calculator. Calculate percentages, percentage change, and fractions with formulas and explanations.',
    iconName: 'Percent',
    keywords: ['percentage calculator', 'calculate percentage', 'percent increase calculator', 'percent decrease', 'what percent of'],
    relatedToolIds: ['discount-calculator', 'gst-calculator', 'simple-interest-calculator'],
    seo: {
      h1: 'Online Percentage Calculator',
      intro: 'Solve common percentage calculations easily: find a percentage of a number, calculate what percentage one number is of another, or determine percentage increase and decrease with clear formulas.',
      howToUse: [
        'Select the calculation mode: "What is X% of Y?", "X is what % of Y?", or "% Increase/Decrease".',
        'Enter your numbers into the input fields.',
        'View the instant computed result with step-by-step mathematical explanation.',
      ],
      features: [
        '3-in-1 calculator covering all standard percentage scenarios.',
        'Shows the exact mathematical formula used for every calculation.',
        'Handles decimals and large values accurately.',
      ],
      formula: 'Percentage = (Part / Total) × 100',
      formulaExplanation: 'To find what percentage a part represents of the total, divide the part by the total and multiply by 100. For percentage increase or decrease: Change% = ((New Value - Old Value) / Old Value) × 100.',
      example: 'To find 15% of $80: (15 / 100) × 80 = $12. If a price moves from $50 to $65: ((65 - 50) / 50) × 100 = 30% increase.',
      faq: [
        {
          q: 'How do you calculate percentage increase?',
          a: 'Subtract the original value from the new value, divide the difference by the original value, and multiply by 100.',
        },
      ],
    },
  },
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    path: '/tools/age-calculator.html',
    category: 'calc',
    popular: true,
    description: 'Calculate your exact age in years, months, and days, plus total days lived and countdown to next birthday.',
    metaDescription: 'Free online age calculator. Calculate exact age in years, months, days, hours, and minutes with next birthday countdown.',
    iconName: 'Calendar',
    keywords: ['age calculator', 'calculate age online', 'exact age in days', 'how old am i', 'birthday countdown'],
    relatedToolIds: ['timestamp-converter', 'percentage-calculator', 'bmi-calculator'],
    seo: {
      h1: 'Online Age Calculator',
      intro: 'Determine your exact age down to the day from your date of birth to today (or any custom target date). Discover total days, hours, minutes lived, the day of the week you were born, and your upcoming birthday.',
      howToUse: [
        'Select your Date of Birth in the date picker.',
        'Optionally select a target date (defaults to today).',
        'Click "Calculate Age" to view your chronological breakdown.',
      ],
      features: [
        'Exact chronological breakdown: Years, Months, and Days.',
        'Calculates total days, weeks, hours, and minutes lived.',
        'Displays the day of the week you were born and days until your next birthday.',
      ],
      formula: 'Age = Target Date - Date of Birth (accounting for leap years and variable month lengths)',
      formulaExplanation: 'The algorithm subtracts birth year, month, and day from the current date, adjusting for borrowing days based on the specific number of days in the preceding month.',
      example: 'Born August 15, 1995 evaluated on September 7, 2026 = 31 Years, 0 Months, 23 Days.',
      faq: [
        {
          q: 'Does this calculator account for leap years?',
          a: 'Yes! Calendar leap years (including February 29) are fully factored into day counts and age computations.',
        },
      ],
    },
  },
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    path: '/tools/bmi-calculator.html',
    category: 'calc',
    popular: true,
    description: 'Calculate Body Mass Index (BMI) using Metric (kg/cm) or Imperial (lbs/ft-in) units with WHO weight categories.',
    metaDescription: 'Free online BMI calculator. Check your Body Mass Index in Metric and Imperial units with official WHO health category classifications.',
    iconName: 'Activity',
    keywords: ['bmi calculator', 'body mass index', 'healthy weight calculator', 'calculate bmi metric imperial', 'who bmi chart'],
    relatedToolIds: ['age-calculator', 'percentage-calculator', 'discount-calculator'],
    seo: {
      h1: 'Online BMI Calculator',
      intro: 'Calculate your Body Mass Index (BMI) to understand your weight category based on the World Health Organization (WHO) standards. Supports both Metric (kg/cm) and Imperial (lbs/ft-in) units.',
      howToUse: [
        'Select your unit system: Metric (cm, kg) or Imperial (ft, in, lbs).',
        'Enter your height and weight.',
        'Click "Calculate BMI" to see your score, category badge, and healthy weight range.',
      ],
      features: [
        'Seamless toggle between Metric and Imperial measurement units.',
        'Visual category indicator: Underweight (<18.5), Normal (18.5–24.9), Overweight (25–29.9), Obese (30+).',
        'Calculates your ideal healthy weight range based on normal BMI thresholds.',
      ],
      formula: 'BMI = Weight (kg) / [Height (m)]²',
      formulaExplanation: 'Body Mass Index is defined as a person’s weight in kilograms divided by the square of their height in meters. For Imperial units: BMI = (Weight in lbs × 703) / (Height in inches)²',
      example: 'Weight = 70 kg, Height = 175 cm (1.75 m): BMI = 70 / (1.75)² = 70 / 3.0625 = 22.86 (Normal weight).',
      faq: [
        {
          q: 'What is considered a healthy BMI score?',
          a: 'According to the World Health Organization, a BMI between 18.5 and 24.9 is considered normal / healthy weight for adults.',
        },
        {
          q: 'Does BMI distinguish between muscle and fat?',
          a: 'BMI is a general population screening tool and does not directly measure body fat percentage or differentiate between muscle mass and fat tissue.',
        },
      ],
    },
  },
  {
    id: 'emi-calculator',
    name: 'EMI Calculator',
    path: '/tools/emi-calculator.html',
    category: 'calc',
    popular: true,
    description: 'Calculate Equated Monthly Installments (EMI) for home loans, car loans, or personal loans with interest breakdowns.',
    metaDescription: 'Free online EMI calculator. Calculate monthly loan payments, total interest payable, and total amount for home, car, and personal loans.',
    iconName: 'CreditCard',
    keywords: ['emi calculator', 'loan emi calculator', 'home loan emi', 'car loan payment', 'calculate monthly emi'],
    relatedToolIds: ['sip-calculator', 'simple-interest-calculator', 'compound-interest-calculator', 'percentage-calculator'],
    seo: {
      h1: 'Online EMI Calculator',
      intro: 'Calculate your Equated Monthly Installment (EMI) for home loans, auto financing, or personal credit. Review your monthly repayment obligation, total interest charged, and total payment.',
      howToUse: [
        'Enter the Principal Loan Amount (P).',
        'Enter the Annual Interest Rate in percentage (R).',
        'Enter the Loan Tenure in years or months (n).',
        'View your exact monthly EMI, total interest payable, and full loan repayment amount.',
      ],
      features: [
        'Accurate standard banking formula: P × r × (1+r)^n / ((1+r)^n - 1).',
        'Visual breakdown of Principal vs Total Interest.',
        'Supports tenure in both years and months.',
      ],
      formula: 'EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)',
      formulaExplanation: 'Where P = Principal loan amount, r = Monthly interest rate (Annual Rate / 12 / 100), and n = Number of monthly payments.',
      example: 'Loan: $100,000 at 8% annual interest for 5 years (60 months): Monthly r = 0.08 / 12 = 0.006667. EMI = $2,027.64. Total interest = $21,658.37.',
      faq: [
        {
          q: 'What factors affect my monthly loan EMI?',
          a: 'Your EMI is determined by the principal borrowed, the interest rate offered by the lender, and the total tenure (duration) of the loan.',
        },
      ],
    },
  },
  {
    id: 'sip-calculator',
    name: 'SIP Calculator',
    path: '/tools/sip-calculator.html',
    category: 'calc',
    popular: true,
    description: 'Calculate future returns on Systematic Investment Plans (SIP) in mutual funds with wealth growth estimates.',
    metaDescription: 'Free online SIP calculator. Calculate expected returns on mutual fund monthly investments with compound growth projections.',
    iconName: 'TrendingUp',
    keywords: ['sip calculator', 'systematic investment plan', 'mutual fund returns', 'sip return calculator', 'investment calculator'],
    relatedToolIds: ['emi-calculator', 'compound-interest-calculator', 'simple-interest-calculator'],
    seo: {
      h1: 'Online SIP Calculator',
      intro: 'Estimate the wealth created through disciplined monthly mutual fund Systematic Investment Plans (SIP). See your total amount invested versus your estimated returns upon maturity.',
      howToUse: [
        'Enter your planned Monthly Investment amount.',
        'Enter your Expected Annual Return Rate (%).',
        'Select the Investment Tenure in years.',
        'View the total invested amount, estimated gains, and final maturity value.',
      ],
      features: [
        'Standard monthly compounding SIP future-value formula.',
        'Visual ratio of invested capital versus accumulated wealth gains.',
        'Financial disclaimer clearly highlighting market assumptions.',
      ],
      formula: 'Maturity Value = P × [((1 + i)^n - 1) / i] × (1 + i)',
      formulaExplanation: 'Where P = Monthly investment amount, i = Periodic monthly rate of return (Annual Rate / 12 / 100), and n = Total number of monthly installments (Tenure in years × 12).',
      example: 'Investing $500/month for 10 years at 12% expected annual return: Total invested = $60,000. Estimated returns = $56,169. Total maturity value = $116,169.',
      faq: [
        {
          q: 'Are SIP returns guaranteed?',
          a: 'No. Mutual funds and market investments are subject to market volatility. SIP calculators provide projections based on assumed average annual return rates.',
        },
      ],
    },
  },
  {
    id: 'gst-calculator',
    name: 'GST Calculator',
    path: '/tools/gst-calculator.html',
    category: 'calc',
    description: 'Calculate Goods and Services Tax (GST) easily: Add GST to net amount or remove GST from gross amount.',
    metaDescription: 'Free online GST calculator. Calculate GST amount, CGST/SGST split, add GST, or reverse calculate net price excluding GST.',
    iconName: 'Receipt',
    keywords: ['gst calculator', 'calculate gst', 'add gst', 'remove gst', 'reverse gst calculator', 'tax calculator'],
    relatedToolIds: ['percentage-calculator', 'discount-calculator', 'simple-interest-calculator'],
    seo: {
      h1: 'Online GST Calculator',
      intro: 'Quickly compute Goods and Services Tax (GST). Calculate total price including tax (Add GST) or extract the original net price and tax portion from a gross invoice amount (Remove GST).',
      howToUse: [
        'Enter the Base or Total Amount.',
        'Select the GST Rate Slab (3%, 5%, 12%, 18%, 28%, or Custom).',
        'Choose whether to "Add GST" or "Remove GST".',
        'View the calculated GST amount, CGST/SGST breakdown (50/50), and total.',
      ],
      features: [
        'Support for standard tax slabs (3%, 5%, 12%, 18%, 28%) and custom tax rates.',
        'Dual mode: Add GST (Forward) and Remove GST (Reverse calculation).',
        'Shows individual CGST and SGST equal breakdown.',
      ],
      formula: 'GST Amount = Original Price × GST Rate / 100 (Add GST) | Net Price = Gross / (1 + Rate/100) (Remove GST)',
      formulaExplanation: 'When adding GST: Total = Price + (Price × Rate / 100). When removing GST: Net Price = Gross Amount / (1 + Rate / 100), and GST Amount = Gross - Net.',
      example: 'Add 18% GST to $1,000: GST = $180 ($90 CGST + $90 SGST). Total = $1,180. Remove 18% GST from $1,180: Net = $1,000, GST = $180.',
      faq: [
        {
          q: 'How does reverse GST calculation work?',
          a: 'To remove GST from an inclusive price, divide the total by (1 + Tax Rate/100) to find the original pre-tax price.',
        },
      ],
    },
  },
  {
    id: 'simple-interest-calculator',
    name: 'Simple Interest Calculator',
    path: '/tools/simple-interest-calculator.html',
    category: 'calc',
    description: 'Calculate Simple Interest (SI) and total maturity amount with the classic SI = (P × R × T) / 100 formula.',
    metaDescription: 'Free online simple interest calculator. Calculate SI, total amount, and interest earned over years or months with step-by-step math.',
    iconName: 'DollarSign',
    keywords: ['simple interest calculator', 'calculate simple interest', 'si formula', 'principal rate time calculator'],
    relatedToolIds: ['compound-interest-calculator', 'emi-calculator', 'percentage-calculator'],
    seo: {
      h1: 'Online Simple Interest Calculator',
      intro: 'Compute simple interest earned or paid on any principal sum over time. Learn the exact interest earned, the final maturity balance, and view the step-by-step formula derivation.',
      howToUse: [
        'Enter the Principal Amount (P).',
        'Enter the Annual Interest Rate % (R).',
        'Enter the Time Period (T) in years or months.',
        'Click "Calculate Interest" to see the total interest and final balance.',
      ],
      features: [
        'Instant simple interest calculation using SI = (P × R × T) / 100.',
        'Supports time in either Years or Months.',
        'Step-by-step explanation with clear examples.',
      ],
      formula: 'SI = (P × R × T) / 100 | Total Amount = P + SI',
      formulaExplanation: 'Where P = Principal borrowed or invested, R = Annual rate of interest in percent, and T = Time duration in years.',
      example: 'Investing $5,000 at 6% annual simple interest for 3 years: SI = (5,000 × 6 × 3) / 100 = $900. Total amount = $5,900.',
      faq: [
        {
          q: 'How does simple interest differ from compound interest?',
          a: 'Simple interest is calculated solely on the original principal sum. Compound interest earns interest on both the principal and previously accumulated interest.',
        },
      ],
    },
  },
  {
    id: 'compound-interest-calculator',
    name: 'Compound Interest Calculator',
    path: '/tools/compound-interest-calculator.html',
    category: 'calc',
    popular: true,
    description: 'Calculate compound interest with flexible compounding intervals: annually, semi-annually, quarterly, monthly, daily.',
    metaDescription: 'Free online compound interest calculator. Calculate future investment value with annual, monthly, quarterly compounding frequencies.',
    iconName: 'PieChart',
    keywords: ['compound interest calculator', 'calculate compound interest', 'compound growth', 'interest compounding monthly quarterly'],
    relatedToolIds: ['simple-interest-calculator', 'sip-calculator', 'emi-calculator'],
    seo: {
      h1: 'Online Compound Interest Calculator',
      intro: 'Harness the power of compounding. Calculate future value and interest accumulated on bank deposits, savings accounts, or investment bonds across various compounding intervals.',
      howToUse: [
        'Enter your initial Principal deposit.',
        'Enter the Annual Interest Rate (%).',
        'Select the Time horizon in years.',
        'Choose Compounding Frequency (Annually, Semi-Annually, Quarterly, Monthly, or Daily).',
        'View the final balance and total interest earned.',
      ],
      features: [
        'Flexible compounding frequencies: Annually, Semi-Annually, Quarterly, Monthly, Daily.',
        'Detailed breakdown of principal versus compound interest earnings.',
        'Clean summary comparing simple interest against compound gains.',
      ],
      formula: 'A = P × (1 + r/n)^(n×t) | CI = A - P',
      formulaExplanation: 'Where A = Final accrued amount, P = Principal, r = Decimal interest rate (R/100), n = Compounding frequency per year, and t = Time in years.',
      example: '$10,000 invested at 7% compounded monthly for 5 years: A = 10,000 × (1 + 0.07/12)^(12×5) = $14,176.25. Interest earned = $4,176.25.',
      faq: [
        {
          q: 'Why does more frequent compounding increase returns?',
          a: 'More frequent compounding (e.g. monthly vs annually) calculates and adds interest to the principal earlier, allowing future interest to be calculated on a larger base.',
        },
      ],
    },
  },
  {
    id: 'discount-calculator',
    name: 'Discount Calculator',
    path: '/tools/discount-calculator.html',
    category: 'calc',
    description: 'Calculate final sale prices, money saved, and additional tax or coupon savings during shopping sales.',
    metaDescription: 'Free online discount calculator. Calculate sale prices, savings amount, and percentage discounts quickly in your browser.',
    iconName: 'Tag',
    keywords: ['discount calculator', 'sale price calculator', 'calculate discount', 'shopping discount', 'percentage off'],
    relatedToolIds: ['percentage-calculator', 'gst-calculator'],
    seo: {
      h1: 'Online Discount Calculator',
      intro: 'Calculate how much you save on clearance sales, Black Friday deals, and promotional discounts. Find the exact discounted price, dollar savings, and final price with optional sales tax.',
      howToUse: [
        'Enter the Original Item Price.',
        'Enter the Discount Percentage (or flat discount amount).',
        'Optionally enter an additional discount or sales tax rate.',
        'Instantly view your Final Price and Total Savings.',
      ],
      features: [
        'Calculate percentage off or fixed dollar discount.',
        'Supports additional coupon discounts and sales tax addition.',
        'Visual savings badge showing real money kept in your pocket.',
      ],
      formula: 'Discount Amount = Original Price × (Discount % / 100) | Final Price = Original Price - Discount Amount',
      formulaExplanation: 'Multiply the original price by the discount percentage to get total savings. Subtract the savings from the original price to determine what you pay.',
      example: 'A $120 jacket with a 25% discount: Savings = $120 × 0.25 = $30. Final price = $90.',
      faq: [
        {
          q: 'How do stacked discounts (like 20% + extra 10%) work?',
          a: 'In retail, stacked discounts are usually calculated consecutively: the first 20% is subtracted, and then the extra 10% is taken off the reduced subtotal.',
        },
      ],
    },
  },

  // ---------------- SEO TOOLS ----------------
  {
    id: 'meta-tag-generator',
    name: 'Meta Tag Generator',
    path: '/tools/meta-tag-generator.html',
    category: 'seo',
    popular: true,
    description: 'Generate production-ready HTML meta tags, Open Graph (Facebook/LinkedIn) and Twitter Cards with live search preview.',
    metaDescription: 'Free online meta tag generator. Create perfect HTML title, description, Open Graph, and Twitter Card tags for SEO.',
    iconName: 'Globe',
    keywords: ['meta tag generator', 'seo meta tags', 'open graph generator', 'twitter card generator', 'html meta generator'],
    relatedToolIds: ['robots-txt-generator', 'sitemap-generator', 'character-counter'],
    seo: {
      h1: 'Online Meta Tag Generator',
      intro: 'Generate search-engine-optimized HTML meta tags, Open Graph tags for social media link sharing on Facebook and LinkedIn, and Twitter Card tags for rich previews on X.',
      howToUse: [
        'Enter your page Title, Description, and Canonical URL.',
        'Set Robots indexing directives (index/noindex, follow/nofollow).',
        'Add Open Graph and Twitter image preview URLs.',
        'Copy the generated HTML snippet and paste it into your <head> tag.',
      ],
      features: [
        'Real-time character count indicators for Title (60 chars) and Description (160 chars).',
        'Generates standard SEO, Open Graph (og:), and Twitter Card meta tags.',
        'Live Google Search snippet and social card preview.',
      ],
      faq: [
        {
          q: 'Where do I paste the generated meta tags?',
          a: 'Paste the generated code inside the <head> and </head> section of your website’s HTML template.',
        },
      ],
    },
  },
  {
    id: 'robots-txt-generator',
    name: 'Robots.txt Generator',
    path: '/tools/robots-txt-generator.html',
    category: 'seo',
    description: 'Create customized robots.txt files with crawl directives for Googlebot, Bingbot, and AI scrapers.',
    metaDescription: 'Free online robots.txt generator. Create search engine crawl directives, disallow rules, and sitemap references easily.',
    iconName: 'Bot',
    keywords: ['robots.txt generator', 'create robots.txt', 'robots txt creator', 'crawler directives', 'disallow bot'],
    relatedToolIds: ['sitemap-generator', 'meta-tag-generator'],
    seo: {
      h1: 'Online Robots.txt Generator',
      intro: 'Create a clean, standardized robots.txt file to instruct web crawlers (like Googlebot and Bingbot) which directories on your server can or cannot be indexed.',
      howToUse: [
        'Set the default crawler rule (Allow All or Disallow All).',
        'Optionally specify crawl delays and add custom disallowed paths (e.g. /admin/, /cart/).',
        'Add your XML sitemap URL.',
        'Copy or download your robots.txt file.',
      ],
      features: [
        'Rule generator for universal (*) and specific user-agents (Googlebot, Bingbot).',
        'One-click download of ready-to-deploy robots.txt.',
        'Disallow directory manager with live preview.',
      ],
      faq: [
        {
          q: 'Where should robots.txt be uploaded?',
          a: 'The robots.txt file must be uploaded to the root directory of your website domain (e.g., https://example.com/robots.txt).',
        },
      ],
    },
  },
  {
    id: 'sitemap-generator',
    name: 'XML Sitemap Generator',
    path: '/tools/sitemap-generator.html',
    category: 'seo',
    description: 'Generate standard XML sitemaps adhering to sitemaps.org schema with priority and change frequencies.',
    metaDescription: 'Free online XML sitemap generator. Create valid sitemap.xml files with changefreq and priority for search engines.',
    iconName: 'Network',
    keywords: ['xml sitemap generator', 'sitemap generator online', 'create sitemap xml', 'google sitemap creator'],
    relatedToolIds: ['robots-txt-generator', 'meta-tag-generator'],
    seo: {
      h1: 'Online XML Sitemap Generator',
      intro: 'Generate an XML sitemap file conforming to the official sitemaps.org protocol. Help search engine bots discover and index all your critical web pages efficiently.',
      howToUse: [
        'Enter your website domain URL.',
        'List your page relative paths (e.g., /about, /contact, /pricing).',
        'Choose change frequency (daily, weekly, monthly) and priority (0.1 to 1.0).',
        'Download your validated sitemap.xml file.',
      ],
      features: [
        'Compliant with standard XML sitemap protocol.',
        'Customizable changefreq and priority tags.',
        'Instant copy and direct sitemap.xml file download.',
      ],
      faq: [
        {
          q: 'What is the purpose of an XML sitemap?',
          a: 'An XML sitemap provides search engines with a structured roadmap of all important pages on your website, accelerating indexing of new and updated content.',
        },
      ],
    },
  },

  // ---------------- UTILITY TOOLS ----------------
  {
    id: 'color-picker',
    name: 'Color Picker & Converter',
    path: '/tools/color-picker.html',
    category: 'utility',
    popular: true,
    description: 'Interactive color picker with HEX, RGB, HSL, and HSV conversion, contrast checker, and palette generator.',
    metaDescription: 'Free online color picker. Convert between HEX, RGB, and HSL formats with WCAG contrast ratio analysis and color harmonies.',
    iconName: 'Palette',
    keywords: ['color picker', 'hex to rgb', 'rgb to hex converter', 'color converter online', 'hsl picker', 'contrast checker'],
    relatedToolIds: ['qr-code-generator', 'uuid-generator'],
    seo: {
      h1: 'Online Color Picker & Converter',
      intro: 'Pick colors visually or convert seamlessly between HEX, RGB, and HSL values. Test readability with real-time WCAG AA contrast compliance and explore complementary color palettes.',
      howToUse: [
        'Use the visual color picker or type a HEX (#3b82f6) / RGB value.',
        'View instant conversions across HEX, RGB, and HSL.',
        'Check contrast readability against black and white text.',
        'Copy any color code format with 1-click.',
      ],
      features: [
        'Instant multi-format synchronization: HEX, RGB, and HSL.',
        'WCAG AA text contrast ratio indicator for accessibility.',
        'Generates complementary, monochromatic, and analogous palettes.',
      ],
      faq: [
        {
          q: 'What is WCAG AA contrast ratio compliance?',
          a: 'WCAG AA requires a minimum contrast ratio of 4.5:1 for normal body text and 3:1 for large text to ensure legibility for users with visual impairments.',
        },
      ],
    },
  },
  {
    id: 'uuid-generator',
    name: 'UUID / GUID Generator',
    path: '/tools/uuid-generator.html',
    category: 'utility',
    popular: true,
    description: 'Generate cryptographically secure random UUID v4 identifiers in bulk with uppercase and hyphen options.',
    metaDescription: 'Free online UUID v4 generator. Generate cryptographically secure random UUIDs and GUIDs individually or in bulk.',
    iconName: 'Fingerprint',
    keywords: ['uuid generator', 'guid generator', 'random uuid v4', 'bulk uuid generator', 'generate unique id'],
    relatedToolIds: ['timestamp-converter', 'base64-encoder', 'color-picker'],
    seo: {
      h1: 'Online UUID v4 Generator',
      intro: 'Generate cryptographically secure Version-4 Universally Unique Identifiers (UUID / GUID) using browser native crypto.randomUUID(). Generate single or bulk IDs instantly.',
      howToUse: [
        'Select the quantity of UUIDs to generate (1, 5, 10, 25, 50, 100).',
        'Toggle uppercase or hyphen removal if desired.',
        'Click "Generate New UUIDs".',
        'Copy all generated UUIDs or download as a text file.',
      ],
      features: [
        'Cryptographically secure generation via Web Cryptography API.',
        'Bulk generation up to 100 IDs at once.',
        'Format customization: Uppercase/lowercase, with or without hyphens.',
      ],
      faq: [
        {
          q: 'Can duplicate UUID v4 identifiers ever occur?',
          a: 'The probability of a collision in UUID v4 is so infinitesimally low (1 in 2^122) that it is virtually impossible in practical computing.',
        },
      ],
    },
  },
  {
    id: 'timestamp-converter',
    name: 'Unix Timestamp Converter',
    path: '/tools/timestamp-converter.html',
    category: 'utility',
    popular: true,
    description: 'Convert Unix timestamps (seconds & milliseconds) to human-readable dates in local time and UTC, or vice versa.',
    metaDescription: 'Free online Unix timestamp converter. Convert epoch seconds and milliseconds to human dates and vice versa in local and UTC time.',
    iconName: 'Clock',
    keywords: ['timestamp converter', 'unix timestamp to date', 'epoch converter', 'date to timestamp', 'epoch time online'],
    relatedToolIds: ['age-calculator', 'uuid-generator'],
    seo: {
      h1: 'Online Unix Timestamp Converter',
      intro: 'Convert Unix epoch timestamps (seconds and milliseconds) into human-readable date and time representations across your local time zone and UTC, or convert any date back into an epoch timestamp.',
      howToUse: [
        'Inspect the live ticking current Unix epoch counter.',
        'Paste an epoch timestamp to convert it into local and UTC date strings.',
        'Or pick a date and time to convert into Unix seconds and milliseconds.',
      ],
      features: [
        'Live ticking Unix epoch clock.',
        'Supports both 10-digit seconds and 13-digit millisecond timestamps.',
        'Outputs in ISO 8601, RFC 2822, Local Time, and UTC.',
      ],
      faq: [
        {
          q: 'What is a Unix timestamp?',
          a: 'A Unix timestamp represents the number of seconds that have elapsed since the Unix Epoch on January 1, 1970 00:00:00 UTC (excluding leap seconds).',
        },
      ],
    },
  },
];

export function getToolByPath(pathname: string): ToolDefinition | undefined {
  const cleanPath = pathname.toLowerCase().trim();
  return TOOLS.find((tool) => tool.path.toLowerCase() === cleanPath || cleanPath.endsWith(tool.id) || cleanPath.endsWith(`${tool.id}.html`));
}

export function getToolById(id: string): ToolDefinition | undefined {
  return TOOLS.find((tool) => tool.id === id);
}

export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return TOOLS.filter((tool) => tool.category === category);
}

export function getPopularTools(): ToolDefinition[] {
  return TOOLS.filter((tool) => tool.popular);
}

export const tools = TOOLS;
export const categories = CATEGORIES.map((c) => ({
  ...c,
  name: c.label,
  toolCount: TOOLS.filter((t) => t.category === c.id).length,
}));
