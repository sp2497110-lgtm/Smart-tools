import { useState, useMemo } from 'react';
import { Copy, Check, Trash2, Download, AlignLeft, RefreshCw, FileText } from 'lucide-react';
import { ToolDefinition } from '../../types';
import { triggerDownload } from '../../utils/imageUtils';

interface Props {
  tool: ToolDefinition;
}

export default function TextTools({ tool }: Props) {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  // For duplicate lines tool
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [trimWhitespace, setTrimWhitespace] = useState(true);

  const handleCopy = (contentToCopy: string) => {
    navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadText = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    triggerDownload(blob, filename);
  };

  // Word & Character stats
  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const charsWithSpaces = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const sentences = trimmed ? (text.match(/[^.!?]+[.!?]+/g) || [text]).length : 0;
    const paragraphs = trimmed ? text.split(/\n+/).filter((p) => p.trim().length > 0).length : 0;
    const readingTimeMins = Math.ceil(words / 200);
    const speakingTimeMins = Math.ceil(words / 130);

    return {
      words,
      charsWithSpaces,
      charsNoSpaces,
      sentences,
      paragraphs,
      readingTimeMins,
      speakingTimeMins,
    };
  }, [text]);

  // Duplicate lines processing
  const deduplicated = useMemo(() => {
    if (!text) return { result: '', originalCount: 0, uniqueCount: 0, removedCount: 0 };
    const lines = text.split('\n');
    const seen = new Set<string>();
    const out: string[] = [];

    for (const line of lines) {
      let key = line;
      if (trimWhitespace) key = key.trim();
      if (!caseSensitive) key = key.toLowerCase();

      if (!seen.has(key)) {
        seen.add(key);
        out.push(line);
      }
    }

    return {
      result: out.join('\n'),
      originalCount: lines.length,
      uniqueCount: out.length,
      removedCount: lines.length - out.length,
    };
  }, [text, caseSensitive, trimWhitespace]);

  // Case converter conversions
  const convertCase = (type: 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'snake' | 'kebab') => {
    if (!text) return;
    let res = '';
    switch (type) {
      case 'upper':
        res = text.toUpperCase();
        break;
      case 'lower':
        res = text.toLowerCase();
        break;
      case 'title':
        res = text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        break;
      case 'sentence':
        res = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
        break;
      case 'camel':
        res = text
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
          .replace(/[^a-zA-Z0-9]/g, '');
        break;
      case 'snake':
        res = text
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[^\w_]/g, '');
        break;
      case 'kebab':
        res = text
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '');
        break;
    }
    setText(res);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-7 shadow-xs space-y-6">
      {/* WORD COUNTER VIEW */}
      {tool.id === 'word-counter' && (
        <div className="space-y-5">
          {/* Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">Words</span>
              <p className="text-2xl font-black text-indigo-950 mt-0.5">{stats.words}</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Characters</span>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{stats.charsWithSpaces}</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">No Spaces</span>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{stats.charsNoSpaces}</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Sentences</span>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{stats.sentences}</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Paragraphs</span>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{stats.paragraphs}</p>
            </div>
            <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Read Time</span>
              <p className="text-2xl font-black text-emerald-950 mt-0.5">{stats.readingTimeMins}m</p>
            </div>
          </div>

          {/* Text Area */}
          <div className="relative">
            <textarea
              rows={9}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your text here to count words, characters, sentences, paragraphs, and reading time in real time..."
              className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-xl font-sans text-sm sm:text-base text-slate-800 focus:outline-indigo-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-400">
              Speaking time estimate: ~{stats.speakingTimeMins} min (130 wpm)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(text)}
                disabled={!text}
                className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer disabled:opacity-40"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
              <button
                onClick={() => setText('')}
                disabled={!text}
                className="px-3.5 py-1.5 text-slate-500 hover:text-red-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHARACTER COUNTER VIEW */}
      {tool.id === 'character-counter' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Twitter Gauge */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Twitter / X</span>
                <span className={stats.charsWithSpaces > 280 ? 'text-red-600 font-black' : 'text-slate-500'}>
                  {stats.charsWithSpaces}/280
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    stats.charsWithSpaces > 280 ? 'bg-red-500' : 'bg-sky-500'
                  }`}
                  style={{ width: `${Math.min(100, (stats.charsWithSpaces / 280) * 100)}%` }}
                />
              </div>
            </div>

            {/* SMS Gauge */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Standard SMS</span>
                <span className={stats.charsWithSpaces > 160 ? 'text-amber-600' : 'text-slate-500'}>
                  {stats.charsWithSpaces}/160
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    stats.charsWithSpaces > 160 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, (stats.charsWithSpaces / 160) * 100)}%` }}
                />
              </div>
            </div>

            {/* SEO Title */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>SEO Title</span>
                <span className={stats.charsWithSpaces > 60 ? 'text-amber-600' : 'text-slate-500'}>
                  {stats.charsWithSpaces}/60
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all"
                  style={{ width: `${Math.min(100, (stats.charsWithSpaces / 60) * 100)}%` }}
                />
              </div>
            </div>

            {/* SEO Meta */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Meta Description</span>
                <span className={stats.charsWithSpaces > 160 ? 'text-amber-600' : 'text-slate-500'}>
                  {stats.charsWithSpaces}/160
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 transition-all"
                  style={{ width: `${Math.min(100, (stats.charsWithSpaces / 160) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <textarea
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste text to track character limits for social media, SMS, and search engine snippets..."
            className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-xl font-sans text-sm sm:text-base text-slate-800 focus:outline-indigo-500 focus:bg-white"
          />

          <div className="flex justify-between items-center text-xs text-slate-500">
            <span>Characters: {stats.charsWithSpaces} • Without spaces: {stats.charsNoSpaces}</span>
            <button
              onClick={() => setText('')}
              className="text-slate-500 hover:text-red-600 cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* CASE CONVERTER VIEW */}
      {tool.id === 'case-converter' && (
        <div className="space-y-5">
          {/* Quick Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => convertCase('upper')}
              className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer border border-slate-200/80"
            >
              UPPERCASE
            </button>
            <button
              onClick={() => convertCase('lower')}
              className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer border border-slate-200/80"
            >
              lowercase
            </button>
            <button
              onClick={() => convertCase('title')}
              className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer border border-slate-200/80"
            >
              Title Case
            </button>
            <button
              onClick={() => convertCase('sentence')}
              className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer border border-slate-200/80"
            >
              Sentence case
            </button>
            <button
              onClick={() => convertCase('camel')}
              className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer border border-slate-200/80 font-mono"
            >
              camelCase
            </button>
            <button
              onClick={() => convertCase('snake')}
              className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer border border-slate-200/80 font-mono"
            >
              snake_case
            </button>
            <button
              onClick={() => convertCase('kebab')}
              className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer border border-slate-200/80 font-mono"
            >
              kebab-case
            </button>
          </div>

          <textarea
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here to convert into any capital or code naming format..."
            className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-xl font-sans text-sm sm:text-base text-slate-800 focus:outline-indigo-500 focus:bg-white"
          />

          <div className="flex justify-between items-center">
            <button
              onClick={() => setText('')}
              className="text-xs text-slate-400 hover:text-red-600 cursor-pointer"
            >
              Clear
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(text)}
                disabled={!text}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Result'}</span>
              </button>
              <button
                onClick={() => handleDownloadText(text, 'converted_text.txt')}
                disabled={!text}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .txt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REMOVE DUPLICATE LINES VIEW */}
      {tool.id === 'remove-duplicate-lines' && (
        <div className="space-y-5">
          {/* Options & Stats */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={caseSensitive}
                  onChange={(e) => setCaseSensitive(e.target.checked)}
                  className="rounded-xs text-indigo-600"
                />
                <span>Case Sensitive</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={trimWhitespace}
                  onChange={(e) => setTrimWhitespace(e.target.checked)}
                  className="rounded-xs text-indigo-600"
                />
                <span>Trim Whitespace</span>
              </label>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-500">Original: <strong>{deduplicated.originalCount}</strong></span>
              <span className="text-emerald-700 font-bold">Unique: {deduplicated.uniqueCount}</span>
              <span className="text-red-600 font-semibold">Removed: {deduplicated.removedCount}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-bold text-slate-600 block mb-1.5">Original Lines</span>
              <textarea
                rows={9}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste list with duplicate items here (one per line)..."
                className="w-full p-3 bg-slate-50/50 border border-slate-200 rounded-xl font-mono text-xs sm:text-sm text-slate-800 focus:outline-indigo-500"
              />
            </div>

            <div>
              <span className="text-xs font-bold text-indigo-700 block mb-1.5">Deduplicated Output</span>
              <textarea
                rows={9}
                readOnly
                value={deduplicated.result}
                placeholder="Unique clean lines appear here..."
                className="w-full p-3 bg-slate-100 border border-indigo-200 rounded-xl font-mono text-xs sm:text-sm text-slate-800 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => handleCopy(deduplicated.result)}
              disabled={!deduplicated.result}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Unique Lines'}</span>
            </button>
            <button
              onClick={() => handleDownloadText(deduplicated.result, 'unique_lines.txt')}
              disabled={!deduplicated.result}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
