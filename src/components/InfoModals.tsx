import { X, ShieldCheck, Mail, FileCheck, Map } from 'lucide-react';
import { CATEGORIES, TOOLS } from '../data/toolsData';

export type InfoModalType = 'privacy' | 'terms' | 'about' | 'contact' | 'sitemap' | null;

interface InfoModalsProps {
  modal?: InfoModalType;
  activeModal?: InfoModalType;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export default function InfoModals({ modal: propsModal, activeModal, onClose, onNavigate }: InfoModalsProps) {
  const modal = activeModal !== undefined ? activeModal : propsModal;
  if (!modal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            {modal === 'privacy' && <ShieldCheck className="w-5 h-5 text-emerald-600" />}
            {modal === 'terms' && <FileCheck className="w-5 h-5 text-indigo-600" />}
            {modal === 'about' && <ShieldCheck className="w-5 h-5 text-blue-600" />}
            {modal === 'contact' && <Mail className="w-5 h-5 text-amber-600" />}
            {modal === 'sitemap' && <Map className="w-5 h-5 text-purple-600" />}
            <h2 className="text-lg font-bold text-slate-900 capitalize">
              {modal === 'privacy'
                ? 'Privacy Policy'
                : modal === 'terms'
                ? 'Terms of Service'
                : modal === 'about'
                ? 'About Smart Tools'
                : modal === 'contact'
                ? 'Contact Us'
                : 'Complete Tool Sitemap'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
          {modal === 'privacy' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-xl text-emerald-900 text-sm">
                <strong>Core Privacy Guarantee:</strong> Your files are processed in your browser whenever possible. We never upload your images, PDF documents, or text inputs to remote servers.
              </div>
              <h3 className="font-semibold text-slate-900 text-base">1. Local Processing Architecture</h3>
              <p>
                Smart Tools uses modern browser technologies (such as HTML5 Canvas, the Web Cryptography API, and client-side WebAssembly) to execute conversions, calculations, compression, and formatting directly on your own device.
              </p>
              <h3 className="font-semibold text-slate-900 text-base">2. File Data Retention</h3>
              <p>
                We do not store, view, retain, or transmit your uploaded photographs, PDF documents, or text entries. When you refresh or navigate away from a tool, in-memory representations are immediately cleared by your browser.
              </p>
              <h3 className="font-semibold text-slate-900 text-base">3. Local Storage</h3>
              <p>
                We only use browser <code>localStorage</code> to remember the names and URLs of the tools you recently used for your convenience. No personal information or file data is ever written to storage.
              </p>
            </div>
          )}

          {modal === 'terms' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 text-base">1. Acceptance of Terms</h3>
              <p>
                By using Smart Tools, you agree to access the utilities for lawful purposes and in accordance with these Terms.
              </p>
              <h3 className="font-semibold text-slate-900 text-base">2. Disclaimer of Financial & Health Advice</h3>
              <p>
                Financial calculators (including EMI, SIP, Simple & Compound Interest, and GST) and health calculators (BMI) provide mathematical estimates and educational projections only. They do not constitute formal financial, tax, or medical advice.
              </p>
              <h3 className="font-semibold text-slate-900 text-base">3. Service Availability</h3>
              <p>
                Smart Tools is provided free of charge on an "as is" and "as available" basis without warranties of any kind.
              </p>
            </div>
          )}

          {modal === 'about' && (
            <div className="space-y-4">
              <p>
                <strong>Smart Tools</strong> is an all-in-one suite of fast, lightweight, and private online tools created to simplify everyday digital tasks.
              </p>
              <p>
                Unlike bloated services that require intrusive signups, slow cloud uploads, and costly subscriptions, Smart Tools focuses on client-side efficiency:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li><strong>Zero Server Uploads:</strong> Image compression, format conversion, PDF splitting, and text analysis happen locally.</li>
                <li><strong>Lightning Speed:</strong> No network upload latency. Process large files at local device speed.</li>
                <li><strong>Accessible Anywhere:</strong> Engineered with a mobile-first, lightweight architecture optimized for phones, tablets, and desktop computers.</li>
              </ul>
            </div>
          )}

          {modal === 'contact' && (
            <div className="space-y-4">
              <p>
                Have a feature suggestion, found a bug, or want a new tool added? We would love to hear from you.
              </p>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="text-sm font-medium text-slate-900">Email Support:</div>
                <div className="font-mono text-indigo-600 select-all">support@smarttools.app</div>
                <div className="text-xs text-slate-500 pt-1">
                  We strive to respond to developer queries and tool requests within 48 hours.
                </div>
              </div>
            </div>
          )}

          {modal === 'sitemap' && (
            <div className="space-y-6">
              <p className="text-xs text-slate-500">
                Browse our complete catalog of {TOOLS.length} browser-based online tools:
              </p>
              {CATEGORIES.map((category) => {
                const catTools = TOOLS.filter((t) => t.category === category.id);
                return (
                  <div key={category.id} className="border-b border-slate-100 pb-4 last:border-b-0">
                    <h3 className="font-bold text-slate-900 mb-2">{category.label}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {catTools.map((tool) => (
                        <button
                          key={tool.id}
                          onClick={() => {
                            onClose();
                            onNavigate(tool.path);
                          }}
                          className="text-left text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 hover:underline py-1 truncate cursor-pointer"
                        >
                          {tool.name}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium text-sm rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
