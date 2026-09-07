import { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { TOOLS } from '../data/toolsData';
import { ToolDefinition } from '../types';
import ToolIcon from './ToolIcon';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (path: string) => void;
}

export default function SearchModal({ isOpen, onClose, onSelectTool }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ToolDefinition[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setResults(TOOLS.slice(0, 8)); // default popular suggestions
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle global keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent if listening, or trigger
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSearch = (val: string) => {
    setQuery(val);
    const cleaned = val.trim().toLowerCase();
    if (!cleaned) {
      setResults(TOOLS.slice(0, 8));
      return;
    }

    const matched = TOOLS.filter((tool) => {
      const nameMatch = tool.name.toLowerCase().includes(cleaned);
      const descMatch = tool.description.toLowerCase().includes(cleaned);
      const keywordMatch = tool.keywords.some((kw) => kw.toLowerCase().includes(cleaned));
      const targetMatch = tool.targetKb ? `${tool.targetKb}kb`.includes(cleaned) : false;
      const catMatch = tool.category.toLowerCase().includes(cleaned);
      return nameMatch || descMatch || keywordMatch || targetMatch || catMatch;
    });

    setResults(matched);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search tools (e.g., 'compress', 'pdf', '50kb', 'json', 'emi')..."
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-base focus:outline-hidden"
            id="global-search-input"
          />
          {query && (
            <button
              onClick={() => handleSearch('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 bg-slate-200/70 hover:bg-slate-300 px-2 py-1 rounded-md transition-colors cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="p-2 overflow-y-auto divide-y divide-slate-100">
          {results.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <p className="text-sm">No tools found matching "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for generic terms like "image", "pdf", "calc", or "json".
              </p>
            </div>
          ) : (
            results.map((tool) => (
              <button
                key={tool.id}
                onClick={() => {
                  onSelectTool(tool.path);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50/60 transition-colors text-left group cursor-pointer"
                id={`search-result-${tool.id}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-indigo-600 text-slate-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                    <ToolIcon name={tool.iconName} className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 group-hover:text-indigo-600 text-sm truncate">
                        {tool.name}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-500 shrink-0">
                        {tool.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5 max-w-sm">
                      {tool.description}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>
            ))
          )}
        </div>

        {/* Search Modal Footer */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>{TOOLS.length} browser-based tools available</span>
          <span className="flex items-center gap-1">
            <CornerDownLeft className="w-3 h-3" /> to select
          </span>
        </div>
      </div>
    </div>
  );
}
