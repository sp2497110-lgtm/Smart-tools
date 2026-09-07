import { useState, useEffect } from 'react';
import { ChevronDown, Sparkles, HelpCircle, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { ToolDefinition } from '../types';
import { getToolById } from '../data/toolsData';
import ToolIcon from './ToolIcon';

interface SeoContentProps {
  tool: ToolDefinition;
  onNavigate: (path: string) => void;
}

export default function SeoContent({ tool, onNavigate }: SeoContentProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const { seo, relatedToolIds } = tool;

  // Render valid FAQPage JSON-LD schema only when FAQs exist
  useEffect(() => {
    if (!seo.faq || seo.faq.length === 0) return;

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: seo.faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'faq-jsonld';
    script.text = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById('faq-jsonld');
      if (existing) existing.remove();
    };
  }, [tool, seo.faq]);

  const relatedTools = relatedToolIds
    .map((id) => getToolById(id))
    .filter((t): t is ToolDefinition => Boolean(t));

  return (
    <div className="mt-12 space-y-12 text-slate-700">
      {/* Introduction & Value Proposition */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-3">
          About {tool.name}
        </h2>
        <p className="text-base sm:text-lg leading-relaxed text-slate-600 max-w-3xl">
          {seo.intro}
        </p>

        {/* Technical formula if provided */}
        {seo.formula && (
          <div className="mt-6 p-5 bg-indigo-50/70 border border-indigo-100 rounded-xl">
            <div className="flex items-center gap-2 text-indigo-900 font-semibold mb-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Calculation Formula</span>
            </div>
            <code className="block bg-white p-3 rounded-lg border border-indigo-200/60 font-mono text-indigo-950 text-sm overflow-x-auto">
              {seo.formula}
            </code>
            {seo.formulaExplanation && (
              <p className="mt-3 text-sm text-indigo-900/90 leading-normal">
                {seo.formulaExplanation}
              </p>
            )}
            {seo.example && (
              <div className="mt-3 pt-3 border-t border-indigo-200/60 text-xs sm:text-sm text-slate-700 font-medium">
                <span className="font-bold text-indigo-950">Example: </span>
                {seo.example}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Two-Column Grid: How To Use & Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* How to use */}
        <section className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              1
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              How to Use {tool.name}
            </h2>
          </div>
          <ol className="space-y-3.5">
            {seo.howToUse.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-slate-600">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-semibold text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Features */}
        <section className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Key Features & Benefits
            </h2>
          </div>
          <ul className="space-y-3.5">
            {seo.features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-slate-600">
                <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* FAQ Section with Accordion */}
      {seo.faq && seo.faq.length > 0 && (
        <section className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2.5 mb-6">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {seo.faq.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200/70 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                    id={`faq-btn-${idx}`}
                  >
                    <span className="text-sm sm:text-base pr-4">{item.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-indigo-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Related Tools Grid */}
      {relatedTools.length > 0 && (
        <section className="pt-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Related Tools You Might Need
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedTools.map((relTool) => (
              <button
                key={relTool.id}
                onClick={() => onNavigate(relTool.path)}
                className="group flex flex-col text-left p-4 sm:p-5 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer"
                id={`related-tool-${relTool.id}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <ToolIcon name={relTool.iconName} className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {relTool.name}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mb-3">
                  {relTool.description}
                </p>
                <div className="mt-auto flex items-center text-xs font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
