import { useState, useEffect, useRef } from 'react';
import { Search, Menu, X, Sparkles, ChevronDown, Shield } from 'lucide-react';
import { CATEGORIES, TOOLS } from '../data/toolsData';
import { ToolDefinition } from '../types';
import ToolIcon from './ToolIcon';

interface HeaderProps {
  onNavigate: (path: string) => void;
  activePath?: string;
  onOpenSearch?: () => void;
}

export default function Header({ onNavigate, activePath = '/', onOpenSearch }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoriesDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
              id="header-brand-logo"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-indigo-100" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                  Smart Tools
                </span>
                <span className="text-[11px] font-medium text-slate-500 -mt-0.5 tracking-wide hidden sm:block">
                  Fast, Free &amp; Private
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-3">
            <button
              onClick={() => onNavigate('/')}
              className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                activePath === '/'
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
              id="nav-home-btn"
            >
              Home
            </button>

            {/* Categories Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 rounded-lg transition-colors cursor-pointer"
                id="nav-categories-dropdown-btn"
                aria-expanded={categoriesDropdownOpen}
              >
                <span>Categories</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    categoriesDropdownOpen ? 'rotate-180 text-indigo-600' : 'text-slate-400'
                  }`}
                />
              </button>

              {categoriesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setCategoriesDropdownOpen(false);
                        onNavigate(`/?category=${cat.id}`);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors cursor-pointer"
                    >
                      <ToolIcon name={cat.icon} className="w-4 h-4 text-slate-400" />
                      <span className="font-medium">{cat.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Popular Shortcut */}
            <button
              onClick={() => onNavigate('/tools/image-compressor.html')}
              className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 rounded-lg transition-colors cursor-pointer"
            >
              Compressor
            </button>
            <button
              onClick={() => onNavigate('/tools/pdf-merger.html')}
              className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 rounded-lg transition-colors cursor-pointer"
            >
              PDF Merger
            </button>
            <button
              onClick={() => onNavigate('/tools/emi-calculator.html')}
              className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 rounded-lg transition-colors cursor-pointer"
            >
              EMI Calc
            </button>
          </nav>

          {/* Right Header Utilities: Search & Mobile Menu Button */}
          <div className="flex items-center gap-2">
            {/* Quick Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-slate-500 bg-slate-100/80 hover:bg-slate-200/70 hover:text-slate-900 border border-slate-200/60 rounded-xl transition-all cursor-pointer shadow-2xs"
              id="header-search-trigger"
              aria-label="Search tools"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Search 40+ tools...</span>
              <span className="sm:hidden">Search</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded-md">
                ⌘K
              </kbd>
            </button>

            {/* Privacy Badge */}
            <div className="hidden xl:flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% In-Browser</span>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              id="mobile-menu-toggle"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Flyout Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200/80 py-4 space-y-3 bg-white animate-in slide-in-from-top-2 duration-150">
            <div className="px-2 space-y-1">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('/');
                }}
                className="w-full text-left px-3 py-2 text-sm font-semibold rounded-lg text-slate-800 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                Home
              </button>
            </div>

            <div className="px-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                Tool Categories
              </div>
              <div className="grid grid-cols-2 gap-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate(`/?category=${cat.id}`);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-left"
                  >
                    <ToolIcon name={cat.icon} className="w-3.5 h-3.5 text-slate-400" />
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="px-2 pt-2 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                Popular Quick Tools
              </div>
              <div className="flex flex-wrap gap-1.5 px-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('/tools/image-compressor.html');
                  }}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-800 rounded-md"
                >
                  Image Compressor
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('/tools/compress-image-to-50kb.html');
                  }}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-800 rounded-md"
                >
                  Compress to 50KB
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('/tools/pdf-merger.html');
                  }}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-800 rounded-md"
                >
                  Merge PDF
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('/tools/emi-calculator.html');
                  }}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-800 rounded-md"
                >
                  EMI Calculator
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
