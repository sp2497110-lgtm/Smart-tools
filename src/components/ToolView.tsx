import React, { useEffect } from 'react';
import { Shield, Sparkles } from 'lucide-react';
import { ToolDefinition } from '../types';
import { addRecentTool } from '../utils/recentTools';
import Breadcrumb from './Breadcrumb';
import SeoContent from './SeoContent';
import AdSlot from './AdSlot';
import ToolIcon from './ToolIcon';

// Tool Components
import ImageCompressorTool from './tools/ImageCompressorTool';
import ImageResizerTool from './tools/ImageResizerTool';
import ImageConvertTool from './tools/ImageConvertTool';
import ImageCropTool from './tools/ImageCropTool';
import ImageRotateTool from './tools/ImageRotateTool';
import PdfCompressorTool from './tools/PdfCompressorTool';
import PdfMergerTool from './tools/PdfMergerTool';
import PdfSplitterTool from './tools/PdfSplitterTool';
import JpgToPdfTool from './tools/JpgToPdfTool';
import PdfToJpgTool from './tools/PdfToJpgTool';
import TextTools from './tools/TextTools';
import DevTools from './tools/DevTools';
import QrCodeTool from './tools/QrCodeTool';
import CalculatorTools from './tools/CalculatorTools';
import SeoTools from './tools/SeoTools';
import UtilityTools from './tools/UtilityTools';

interface ToolViewProps {
  tool: ToolDefinition;
  onNavigate: (path: string) => void;
}

/*
 * Tool-specific SEO metadata.
 * Primary keywords and long-tail search phrases are used naturally.
 */
const SEO_DATA: Record<
  string,
  {
    title: string;
    description: string;
  }
> = {
  'image-compressor': {
    title: 'Image Compressor Online Free - Compress JPG, PNG & WebP | Smart Tools',
    description:
      'Compress JPG, PNG and WebP images online for free. Reduce image size quickly while maintaining good quality with this private browser-based image compressor.',
  },

  'compress-image-to-20kb': {
    title: 'Compress Image to 20KB Online Free | JPG & PNG Compressor',
    description:
      'Compress JPG and PNG images to 20KB online for free. Reduce photo file size quickly in your browser without uploading images to a server.',
  },

  'compress-image-to-50kb': {
    title: 'Compress Image to 50KB Online Free | JPG & PNG',
    description:
      'Compress images to 50KB online for free. Reduce JPG and PNG photo size quickly for forms, applications and websites using a private browser-based tool.',
  },

  'compress-image-to-100kb': {
    title: 'Compress Image to 100KB Online Free | JPG & PNG',
    description:
      'Compress JPG and PNG images to 100KB online for free. Reduce image file size for online forms, applications, websites and document uploads.',
  },

  'compress-image-to-200kb': {
    title: 'Compress Image to 200KB Online Free | JPG & PNG',
    description:
      'Compress JPG and PNG images to 200KB online for free. Quickly reduce photo size in your browser while keeping useful image quality.',
  },

  'compress-image-to-500kb': {
    title: 'Compress Image to 500KB Online Free | JPG & PNG',
    description:
      'Compress JPG and PNG images to 500KB online for free. Reduce large photo file sizes quickly with a private browser-based image compressor.',
  },

  'image-resizer': {
    title: 'Image Resizer Online Free - Resize JPG, PNG & WebP',
    description:
      'Resize JPG, PNG and WebP images online for free. Change image width and height quickly with this simple browser-based image resizer.',
  },

  'jpg-to-png': {
    title: 'JPG to PNG Converter Online Free | Convert JPG to PNG',
    description:
      'Convert JPG images to PNG online for free. Quickly convert JPG to PNG in your browser without installing software or uploading files to a server.',
  },

  'png-to-jpg': {
    title: 'PNG to JPG Converter Online Free | Convert PNG to JPG',
    description:
      'Convert PNG images to JPG online for free. Quickly change PNG files to JPG format directly in your browser with an easy image converter.',
  },

  'jpg-to-webp': {
    title: 'JPG to WebP Converter Online Free | Convert JPG to WebP',
    description:
      'Convert JPG images to WebP online for free. Create smaller modern image files directly in your browser with this fast JPG to WebP converter.',
  },

  'webp-to-jpg': {
    title: 'WebP to JPG Converter Online Free | Convert WebP to JPG',
    description:
      'Convert WebP images to JPG online for free. Quickly change WebP files into JPG format in your browser without installing additional software.',
  },

  'image-cropper': {
    title: 'Image Cropper Online Free - Crop JPG, PNG & WebP',
    description:
      'Crop JPG, PNG and WebP images online for free. Select the exact area you need and create a cropped image directly in your browser.',
  },

  'image-rotator': {
    title: 'Rotate Image Online Free - Rotate JPG & PNG Images',
    description:
      'Rotate JPG and PNG images online for free. Turn images clockwise or counterclockwise directly in your browser with this simple image rotator.',
  },

  'pdf-compressor': {
    title: 'PDF Compressor Online Free - Reduce PDF File Size',
    description:
      'Compress PDF files online for free and reduce PDF file size for sharing, uploading and storage. Use the browser-based PDF compressor from Smart Tools.',
  },

  'pdf-merger': {
    title: 'Merge PDF Online Free - Combine Multiple PDF Files',
    description:
      'Merge multiple PDF files into one document online for free. Combine PDF files quickly in your browser with the Smart Tools PDF merger.',
  },

  'pdf-splitter': {
    title: 'Split PDF Online Free - Extract Pages from PDF',
    description:
      'Split PDF files online for free and extract pages from a PDF document. Quickly separate PDF pages using this browser-based PDF splitter.',
  },

  'jpg-to-pdf': {
    title: 'JPG to PDF Converter Online Free - Convert Images to PDF',
    description:
      'Convert JPG images to PDF online for free. Create PDF documents from images quickly in your browser without installing software.',
  },

  'pdf-to-jpg': {
    title: 'PDF to JPG Converter Online Free - Convert PDF Pages',
    description:
      'Convert PDF pages to JPG images online for free. Quickly extract PDF pages as JPG images using this simple browser-based PDF converter.',
  },

  'word-counter': {
    title: 'Word Counter Online Free - Count Words & Characters',
    description:
      'Count words and characters online for free. Check word count, character count and text length instantly with this simple online word counter.',
  },

  'character-counter': {
    title: 'Character Counter Online Free - Count Characters & Words',
    description:
      'Count characters, words and text length online for free. Get an instant character count for writing, social media, forms and other content.',
  },

  'case-converter': {
    title: 'Case Converter Online Free - Uppercase, Lowercase & More',
    description:
      'Convert text to uppercase, lowercase, title case and other formats online for free. Quickly change text case directly in your browser.',
  },

  'remove-duplicate-lines': {
    title: 'Remove Duplicate Lines Online Free - Clean Text',
    description:
      'Remove duplicate lines from text online for free. Clean repeated lines and organize text quickly with this browser-based duplicate line remover.',
  },

  'json-formatter': {
    title: 'JSON Formatter Online Free - Format & Beautify JSON',
    description:
      'Format and beautify JSON online for free. Make JSON data easier to read, inspect and debug with this browser-based JSON formatter.',
  },

  'json-validator': {
    title: 'JSON Validator Online Free - Validate JSON Data',
    description:
      'Validate JSON online for free and check whether your JSON data is correctly formatted. Quickly find JSON syntax problems in your browser.',
  },

  'json-minifier': {
    title: 'JSON Minifier Online Free - Compress JSON Data',
    description:
      'Minify and compress JSON online for free. Remove unnecessary spaces and formatting from JSON data quickly with this browser-based JSON minifier.',
  },

  'base64-encoder-decoder': {
    title: 'Base64 Encoder Decoder Online Free - Encode & Decode Base64',
    description:
      'Encode and decode Base64 text online for free. Convert text to Base64 or decode Base64 strings quickly using this browser-based developer tool.',
  },

  'url-encoder-decoder': {
    title: 'URL Encoder Decoder Online Free - Encode & Decode URLs',
    description:
      'Encode and decode URLs online for free. Convert URL text into encoded format or decode URL-encoded strings quickly in your browser.',
  },

  'qr-code-generator': {
    title: 'QR Code Generator Online Free - Create QR Codes',
    description:
      'Create QR codes online for free from URLs, text and other information. Generate a QR code quickly with this simple browser-based QR code generator.',
  },

  'percentage-calculator': {
    title: 'Percentage Calculator Online Free - Calculate Percentages',
    description:
      'Calculate percentages online for free. Find percentage increase, decrease and percentage values quickly with this easy online percentage calculator.',
  },

  'age-calculator': {
    title: 'Age Calculator Online Free - Calculate Your Exact Age',
    description:
      'Calculate age online for free using date of birth. Find your exact age in years, months and days with this simple online age calculator.',
  },

  'bmi-calculator': {
    title: 'BMI Calculator Online Free - Calculate Body Mass Index',
    description:
      'Calculate BMI online for free using height and weight. Get your Body Mass Index quickly with this simple browser-based BMI calculator.',
  },

  'emi-calculator': {
    title: 'EMI Calculator Online Free - Calculate Loan EMI',
    description:
      'Calculate loan EMI online for free. Estimate monthly EMI, interest and total payment using this easy online EMI calculator for loans.',
  },

  'sip-calculator': {
    title: 'SIP Calculator Online Free - Calculate SIP Returns',
    description:
      'Calculate estimated SIP returns online for free. Enter investment amount, duration and expected return to estimate your SIP investment value.',
  },

  'gst-calculator': {
    title: 'GST Calculator Online Free - Calculate GST Amount',
    description:
      'Calculate GST online for free. Add or remove GST and calculate tax amounts quickly with this simple online GST calculator.',
  },

  'simple-interest-calculator': {
    title: 'Simple Interest Calculator Online Free - Calculate SI',
    description:
      'Calculate simple interest online for free. Find interest and total amount using principal, rate and time with this simple interest calculator.',
  },

  'compound-interest-calculator': {
    title: 'Compound Interest Calculator Online Free - Calculate CI',
    description:
      'Calculate compound interest online for free. Estimate interest and final amount using principal, rate, time and compounding frequency.',
  },

  'discount-calculator': {
    title: 'Discount Calculator Online Free - Calculate Sale Price',
    description:
      'Calculate discounts and final sale prices online for free. Quickly find discount amount and price after discount with this online calculator.',
  },

  'meta-tag-generator': {
    title: 'Meta Tag Generator Online Free - Create SEO Meta Tags',
    description:
      'Generate SEO meta tags online for free. Create title, description and other useful meta tags for your website quickly with this SEO tool.',
  },

  'robots-txt-generator': {
    title: 'Robots.txt Generator Online Free - Create Robots.txt',
    description:
      'Generate a robots.txt file online for free. Create useful robots.txt rules for search engine crawlers with this simple SEO tool.',
  },

  'sitemap-generator': {
    title: 'Sitemap Generator Online Free - Create XML Sitemap',
    description:
      'Generate an XML sitemap online for free. Create a sitemap for your website to help search engines discover important pages.',
  },

  'color-picker': {
    title: 'Color Picker Online Free - Pick HEX, RGB & Colors',
    description:
      'Pick colors online for free and get useful color values such as HEX and RGB. Use this simple browser-based online color picker.',
  },

  'uuid-generator': {
    title: 'UUID Generator Online Free - Generate Random UUIDs',
    description:
      'Generate UUIDs online for free. Create random universally unique identifiers quickly with this simple browser-based UUID generator.',
  },

  'timestamp-converter': {
    title: 'Unix Timestamp Converter Online Free - Convert Timestamps',
    description:
      'Convert Unix timestamps online for free. Convert timestamps to readable dates and dates to Unix timestamps with this developer utility.',
  },
};

export default function ToolView({ tool, onNavigate }: ToolViewProps) {
  // Update SEO metadata & record in recently used tools
  useEffect(() => {
    const seo = SEO_DATA[tool.id];

    const seoTitle = seo?.title || `${tool.name} - Smart Tools`;
    const seoDescription =
      seo?.description || tool.description;

    // Page title
    document.title = seoTitle;

    // Meta description
    let metaDesc = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement | null;

    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }

    metaDesc.setAttribute('content', seoDescription);

    // Robots
    let robotsMeta = document.querySelector(
      'meta[name="robots"]'
    ) as HTMLMetaElement | null;

    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }

    robotsMeta.setAttribute(
      'content',
      'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );

    // Canonical URL
    const canonicalUrl = `https://toolzy.online${window.location.pathname}`;

    let canonical = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;

    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }

    canonical.setAttribute('href', canonicalUrl);

    // Open Graph title
    let ogTitle = document.querySelector(
      'meta[property="og:title"]'
    ) as HTMLMetaElement | null;

    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }

    ogTitle.setAttribute('content', seoTitle);

    // Open Graph description
    let ogDescription = document.querySelector(
      'meta[property="og:description"]'
    ) as HTMLMetaElement | null;

    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }

    ogDescription.setAttribute('content', seoDescription);

    // Open Graph URL
    let ogUrl = document.querySelector(
      'meta[property="og:url"]'
    ) as HTMLMetaElement | null;

    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }

    ogUrl.setAttribute('content', canonicalUrl);

    // Keep existing behavior
    window.scrollTo({ top: 0, behavior: 'smooth' });
    addRecentTool(tool);
  }, [tool]);

  // Render matching tool UI
  const renderToolWidget = () => {
    switch (tool.id) {
      case 'image-compressor':
      case 'compress-image-to-20kb':
      case 'compress-image-to-50kb':
      case 'compress-image-to-100kb':
      case 'compress-image-to-200kb':
      case 'compress-image-to-500kb':
        return <ImageCompressorTool tool={tool} />;

      case 'image-resizer':
        return <ImageResizerTool />;

      case 'jpg-to-png':
        return <ImageConvertTool sourceFormat="jpg" targetFormat="png" />;

      case 'png-to-jpg':
        return <ImageConvertTool sourceFormat="png" targetFormat="jpg" />;

      case 'jpg-to-webp':
        return <ImageConvertTool sourceFormat="jpg" targetFormat="webp" />;

      case 'webp-to-jpg':
        return <ImageConvertTool sourceFormat="webp" targetFormat="jpg" />;

      case 'image-cropper':
        return <ImageCropTool />;

      case 'image-rotator':
        return <ImageRotateTool />;

      case 'pdf-compressor':
        return <PdfCompressorTool />;

      case 'pdf-merger':
        return <PdfMergerTool />;

      case 'pdf-splitter':
        return <PdfSplitterTool />;

      case 'jpg-to-pdf':
        return <JpgToPdfTool />;

      case 'pdf-to-jpg':
        return <PdfToJpgTool />;

      case 'word-counter':
      case 'character-counter':
      case 'case-converter':
      case 'remove-duplicate-lines':
        return <TextTools tool={tool} />;

      case 'json-formatter':
      case 'json-validator':
      case 'json-minifier':
      case 'base64-encoder-decoder':
      case 'url-encoder-decoder':
        return <DevTools tool={tool} />;

      case 'qr-code-generator':
        return <QrCodeTool />;

      case 'percentage-calculator':
      case 'age-calculator':
      case 'bmi-calculator':
      case 'emi-calculator':
      case 'sip-calculator':
      case 'gst-calculator':
      case 'simple-interest-calculator':
      case 'compound-interest-calculator':
      case 'discount-calculator':
        return <CalculatorTools tool={tool} />;

      case 'meta-tag-generator':
      case 'robots-txt-generator':
      case 'sitemap-generator':
        return <SeoTools tool={tool} />;

      case 'color-picker':
      case 'uuid-generator':
      case 'timestamp-converter':
        return <UtilityTools tool={tool} />;

      default:
        return <ImageCompressorTool tool={tool} />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Top Ad Slot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <AdSlot type="top" />
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs */}
        <Breadcrumb tool={tool} onNavigate={onNavigate} />

        {/* Tool Header Card */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0 shadow-2xs">
              <ToolIcon name={tool.iconName} className="w-6 h-6" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {tool.name}
                </h1>

                {tool.popular && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Popular
                  </span>
                )}
              </div>

              <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                {tool.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/80 shrink-0 self-start sm:self-auto">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Browser-Based &bull; Private</span>
          </div>
        </div>

        {/* Interactive Tool Widget */}
        <div id="tool-workspace" className="relative">
          {renderToolWidget()}
        </div>

      
        
