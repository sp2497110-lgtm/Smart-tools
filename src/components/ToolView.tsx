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

export default function ToolView({ tool, onNavigate }: ToolViewProps) {
  // Update SEO metadata & record in recently used tools
  useEffect(() => {
    document.title = `${tool.name} - Smart Tools`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', tool.description);
    }
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

        {/* Content Ad Slot */}
        <div className="my-8">
          <AdSlot type="between-content" />
        </div>

        {/* Rich SEO Content (How to Use, Features, Technical Formulas, FAQs, Related Tools) */}
        <SeoContent tool={tool} onNavigate={onNavigate} />

        {/* Bottom Ad Slot */}
        <div className="mt-12">
          <AdSlot type="bottom" />
        </div>
      </main>
    </div>
  );
}
