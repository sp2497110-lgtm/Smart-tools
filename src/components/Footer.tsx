import { Shield, Sparkles, Heart } from 'lucide-react';
import { CATEGORIES } from '../data/toolsData';
import { InfoModalType } from './InfoModals';

interface FooterProps {
  onNavigate: (path: string) => void;
  onOpenModal: (type: InfoModalType) => void;
}

export default function Footer({ onNavigate, onOpenModal }: FooterProps) {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 text-slate-600">
      {/* Privacy Guarantee Banner */}
      <div className="bg-slate-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm sm:text-base text-white">
                Strict Browser-Based Privacy
              </p>
              <p className="text-xs sm:text-sm text-slate-300">
                Your files are processed in your browser whenever possible. We never upload your sensitive images or documents.
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenModal('privacy')}
            className="text-xs sm:text-sm text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-4 cursor-pointer shrink-0"
          >
            Read Privacy Architecture →
          </button>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-slate-900">Smart Tools</span>
            </div>
            <p className="text-sm text-slate-500 max-w-sm mb-4 leading-relaxed">
              Fast, free &amp; private online tools. Perform common image, PDF, text, developer, calculator, SEO, and utility tasks directly inside your web browser.
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <p>Designed for desktop, tablet, and mobile browsers.</p>
              <p>Zero tracking, zero server uploads, 100% free.</p>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Categories
            </h3>
            <ul className="space-y-2 text-sm">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onNavigate(`/?category=${cat.id}`)}
                    className="hover:text-indigo-600 transition-colors text-left cursor-pointer"
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              More Tools
            </h3>
            <ul className="space-y-2 text-sm">
              {CATEGORIES.slice(5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onNavigate(`/?category=${cat.id}`)}
                    className="hover:text-indigo-600 transition-colors text-left cursor-pointer"
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onOpenModal('sitemap')}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                >
                  View All Tools →
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Company &amp; Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onOpenModal('about')}
                  className="hover:text-indigo-600 transition-colors text-left cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenModal('contact')}
                  className="hover:text-indigo-600 transition-colors text-left cursor-pointer"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenModal('privacy')}
                  className="hover:text-indigo-600 transition-colors text-left cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenModal('terms')}
                  className="hover:text-indigo-600 transition-colors text-left cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenModal('sitemap')}
                  className="hover:text-indigo-600 transition-colors text-left cursor-pointer"
                >
                  XML &amp; HTML Sitemap
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-slate-200 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} Smart Tools. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Built for speed, accuracy &amp; privacy</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
