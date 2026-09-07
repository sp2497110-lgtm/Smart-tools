import { useState, useMemo } from 'react';
import { Search, Sparkles, Shield, Zap, Lock, HeartHandshake, History, ArrowRight, X } from 'lucide-react';
import { tools, categories } from '../data/toolsData';
import { ToolCategory, ToolDefinition } from '../types';
import { getRecentTools, clearRecentTools } from '../utils/recentTools';
import ToolIcon from './ToolIcon';
import AdSlot from './AdSlot';

interface HomeViewProps {
  onNavigate: (path: string) => void;
  selectedCategory?: ToolCategory | null;
  onSelectCategory?: (cat: ToolCategory | null) => void;
  onOpenSearch: () => void;
}

export default function HomeView({
  onNavigate,
  selectedCategory,
  onSelectCategory,
  onOpenSearch,
}: HomeViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentList, setRecentList] = useState<ToolDefinition[]>(getRecentTools());

  const handleClearRecents = () => {
    clearRecentTools();
    setRecentList([]);
  };

  // Filter tools based on search query and category filter
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCat = !selectedCategory || tool.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.keywords.some((t) => t.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const popularTools = useMemo(() => {
    return tools.filter((t) => t.popular);
  }, []);

  return (
    <div className="min-h-screen space-y-8 pb-16">
      {/* Top Banner Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <AdSlot type="top" />
      </div>

      {/* Hero Header */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-6 sm:pt-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 mb-4 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>40+ Free, Fast &amp; Completely In-Browser Tools</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight sm:leading-none">
          Fast, Free &amp; Private <br className="hidden sm:inline" />
          <span className="text-indigo-600">Online Utilities</span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Compress images to exact KB targets, merge &amp; split PDFs, calculate financial metrics, and format code. All processing happens 100% inside your web browser.
        </p>

        {/* Global Instant Search Box */}
        <div className="mt-7 max-w-2xl mx-auto relative">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 40+ tools (e.g. compress to 50kb, merge pdf, emi calculator)..."
              className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-300 rounded-2xl shadow-sm text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => onSelectCategory && onSelectCategory(null)}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              !selectedCategory
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            All Categories ({tools.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory && onSelectCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {cat.name} ({cat.toolCount})
            </button>
          ))}
        </div>
      </section>

      {/* Recently Used Tools Bar (if any) */}
      {recentList.length > 0 && !searchQuery && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <History className="w-4 h-4 text-indigo-600" />
                <span>Recently Used Tools</span>
              </div>
              <button
                onClick={handleClearRecents}
                className="text-xs text-slate-400 hover:text-red-600 font-medium transition-colors cursor-pointer"
              >
                Clear History
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {recentList.slice(0, 6).map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => onNavigate(tool.path)}
                  className="flex items-center gap-2 p-2.5 bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/80 hover:border-indigo-200 rounded-xl transition-all text-left cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <ToolIcon name={tool.iconName} className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800 group-hover:text-indigo-900 truncate">
                    {tool.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Tools Showcase (when no filter or query active) */}
      {!searchQuery && !selectedCategory && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Most Popular Tools</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">High-demand tools used by millions worldwide</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {popularTools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => onNavigate(tool.path)}
                className="bg-white border border-slate-200/90 hover:border-indigo-300 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100/80 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-2xs">
                      <ToolIcon name={tool.iconName} className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full">
                      Popular
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-base line-clamp-1">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Middle Content Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot type="between-content" />
      </div>

      {/* Primary Tool Directory / Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {selectedCategory ? (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 capitalize">
                  {categories.find((c) => c.id === selectedCategory)?.name || selectedCategory}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {categories.find((c) => c.id === selectedCategory)?.description}
                </p>
              </div>
              <button
                onClick={() => onSelectCategory && onSelectCategory(null)}
                className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer"
              >
                View all categories
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredTools.map((tool) => (
                <div
                  key={tool.id}
                  onClick={() => onNavigate(tool.path)}
                  className="bg-white border border-slate-200/90 hover:border-indigo-300 rounded-2xl p-4.5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 text-indigo-600 flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <ToolIcon name={tool.iconName} className="w-4.5 h-4.5" />
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm sm:text-base">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-indigo-600">
                    <span>Use free</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : searchQuery ? (
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Search Results ({filteredTools.length})
              </h2>
            </div>
            {filteredTools.length === 0 ? (
              <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl">
                <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <div className="font-bold text-slate-700">No matching tools found</div>
                <div className="text-xs text-slate-500 mt-1">
                  Try searching for keywords like "pdf", "compress", "calculate", or "json"
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredTools.map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => onNavigate(tool.path)}
                    className="bg-white border border-slate-200/90 hover:border-indigo-300 rounded-2xl p-4.5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 text-indigo-600 flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <ToolIcon name={tool.iconName} className="w-4.5 h-4.5" />
                      </div>
                      <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                    <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-indigo-600">
                      <span>Launch</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          categories.map((cat) => {
            const catTools = tools.filter((t) => t.category === cat.id);
            if (catTools.length === 0) return null;
            return (
              <div key={cat.id} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                      <ToolIcon name={cat.icon} className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                        {cat.name}
                      </h2>
                      <p className="text-xs text-slate-500">{cat.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectCategory && onSelectCategory(cat.id)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View all ({catTools.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                  {catTools.map((tool) => (
                    <div
                      key={tool.id}
                      onClick={() => onNavigate(tool.path)}
                      className="bg-white border border-slate-200/90 hover:border-indigo-300 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <ToolIcon name={tool.iconName} className="w-4 h-4" />
                          </div>
                          {tool.popular && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md">
                              Popular
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm">
                          {tool.name}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                          {tool.description}
                        </p>
                      </div>

                      <div className="mt-3.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500 group-hover:text-indigo-600">
                        <span>Open tool</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Trust & Value Proposition Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-linear-to-b from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
              Architected for Privacy &amp; Speed
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">
              Why Professionals Choose Smart Tools
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-slate-800/60 border border-slate-700/60 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">100% Client-Side Privacy</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                Your images, documents, and code never leave your device. All calculations, rendering, and compression run purely inside your web browser.
              </p>
            </div>

            <div className="p-5 bg-slate-800/60 border border-slate-700/60 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Instant Hardware Acceleration</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                Zero network latency, zero upload queues, and no wait times. Utilizes your local machine's multi-core CPU and GPU canvas pipelines.
              </p>
            </div>

            <div className="p-5 bg-slate-800/60 border border-slate-700/60 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Free Forever &amp; Clean UX</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                No credit card, no sign-up forms, and no aggressive deceptive popups. Optimized for Google Core Web Vitals and standard AdSense compliance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Ad Slot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot type="bottom" />
      </div>
    </div>
  );
}
