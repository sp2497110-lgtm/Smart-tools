import { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw, Download, Palette, Fingerprint, Clock, CheckCircle } from 'lucide-react';
import { ToolDefinition } from '../../types';
import { triggerDownload } from '../../utils/imageUtils';

interface Props {
  tool: ToolDefinition;
}

export default function UtilityTools({ tool }: Props) {
  const [copied, setCopied] = useState(false);

  // COLOR PICKER STATE
  const [hexColor, setHexColor] = useState('#6366F1');

  // UUID GENERATOR STATE
  const [uuidCount, setUuidCount] = useState<number>(5);
  const [uuidUpper, setUuidUpper] = useState(false);
  const [uuidNoHyphen, setUuidNoHyphen] = useState(false);
  const [uuids, setUuids] = useState<string[]>([]);

  // TIMESTAMP CONVERTER STATE
  const [currentSec, setCurrentSec] = useState(Math.floor(Date.now() / 1000));
  const [currentMs, setCurrentMs] = useState(Date.now());
  const [inputTs, setInputTs] = useState(String(Math.floor(Date.now() / 1000)));
  const [inputDate, setInputDate] = useState(new Date().toISOString().slice(0, 16));

  // Ticking clock for timestamp
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setCurrentMs(now);
      setCurrentSec(Math.floor(now / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate UUIDs
  const generateUuids = (count: number, upper: boolean, noHyphen: boolean) => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      let id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });

      if (noHyphen) id = id.replace(/-/g, '');
      if (upper) id = id.toUpperCase();
      list.push(id);
    }
    setUuids(list);
  };

  useEffect(() => {
    if (tool.id === 'uuid-generator') {
      generateUuids(uuidCount, uuidUpper, uuidNoHyphen);
    }
  }, [tool.id, uuidCount, uuidUpper, uuidNoHyphen]);

  // Color conversions
  const hexToRgb = (hex: string) => {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map((x) => x + x).join('');
    const num = parseInt(c, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };

  const rgb = hexToRgb(hexColor);
  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

  // Timestamp parsing
  const parsedDateFromTs = () => {
    const val = parseInt(inputTs, 10);
    if (isNaN(val)) return null;
    const ms = val > 9999999999 ? val : val * 1000;
    const d = new Date(ms);
    if (isNaN(d.getTime())) return null;
    return {
      utc: d.toUTCString(),
      local: d.toLocaleString(),
      iso: d.toISOString(),
    };
  };

  const parsedTsFromDate = () => {
    const d = new Date(inputDate);
    if (isNaN(d.getTime())) return null;
    return {
      sec: Math.floor(d.getTime() / 1000),
      ms: d.getTime(),
    };
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-7 shadow-xs space-y-6">
      {/* COLOR PICKER TOOL */}
      {tool.id === 'color-picker' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Color Swatch */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div
                className="w-full h-44 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center transition-colors"
                style={{ backgroundColor: hexColor }}
              >
                <input
                  type="color"
                  value={hexColor}
                  onChange={(e) => setHexColor(e.target.value)}
                  className="w-20 h-20 opacity-0 cursor-pointer"
                  title="Click to pick color"
                />
              </div>
              <span className="text-xs text-slate-400 mt-2">
                Click swatch above to open native color palette
              </span>
            </div>

            {/* Values */}
            <div className="md:col-span-7 space-y-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-bold uppercase">HEX Code</span>
                  <div className="text-base font-mono font-bold text-slate-900">{hexColor.toUpperCase()}</div>
                </div>
                <button
                  onClick={() => handleCopy(hexColor.toUpperCase())}
                  className="p-2 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-200/60 cursor-pointer"
                  title="Copy HEX"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-bold uppercase">RGB Code</span>
                  <div className="text-base font-mono font-bold text-slate-900">{rgbString}</div>
                </div>
                <button
                  onClick={() => handleCopy(rgbString)}
                  className="p-2 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-200/60 cursor-pointer"
                  title="Copy RGB"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-bold uppercase">CSS Variable</span>
                  <div className="text-xs font-mono font-bold text-slate-700">
                    --color-accent: {hexColor};
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(`--color-accent: ${hexColor};`)}
                  className="p-2 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-200/60 cursor-pointer"
                  title="Copy CSS"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UUID GENERATOR */}
      {tool.id === 'uuid-generator' && (
        <div className="space-y-6">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span className="text-slate-600">Quantity:</span>
                <select
                  value={uuidCount}
                  onChange={(e) => setUuidCount(parseInt(e.target.value, 10))}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-indigo-500 cursor-pointer"
                >
                  {[1, 5, 10, 25, 50, 100].map((n) => (
                    <option key={n} value={n}>
                      {n} UUIDs
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={uuidUpper}
                  onChange={(e) => setUuidUpper(e.target.checked)}
                  className="rounded-xs text-indigo-600"
                />
                <span>Uppercase</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={uuidNoHyphen}
                  onChange={(e) => setUuidNoHyphen(e.target.checked)}
                  className="rounded-xs text-indigo-600"
                />
                <span>Remove Hyphens</span>
              </label>
            </div>

            <button
              onClick={() => generateUuids(uuidCount, uuidUpper, uuidNoHyphen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate</span>
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Cryptographically Secure Version 4 UUIDs</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(uuids.join('\n'))}
                  className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied All' : 'Copy All'}</span>
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([uuids.join('\n')], { type: 'text/plain' });
                    triggerDownload(blob, 'uuids.txt');
                  }}
                  className="text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-emerald-400 space-y-1.5 max-h-80 overflow-y-auto">
              {uuids.map((id, idx) => (
                <div
                  key={idx}
                  onClick={() => handleCopy(id)}
                  className="hover:bg-slate-800/80 p-1 rounded-md transition-colors cursor-pointer flex justify-between group"
                  title="Click to copy single UUID"
                >
                  <span>{id}</span>
                  <span className="opacity-0 group-hover:opacity-100 text-slate-400 text-[10px]">
                    Click to copy
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TIMESTAMP CONVERTER */}
      {tool.id === 'timestamp-converter' && (
        <div className="space-y-6">
          {/* Live Clock Ticker Banner */}
          <div className="p-5 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block">
                Current Unix Timestamp (Ticking)
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-black text-indigo-950 mt-1">
                {currentSec} <span className="text-sm font-sans font-normal text-indigo-700">(seconds)</span>
              </div>
              <div className="text-xs font-mono text-indigo-800 mt-0.5">
                {currentMs} (milliseconds)
              </div>
            </div>
            <button
              onClick={() => handleCopy(String(currentSec))}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Current Timestamp</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Timestamp to Date */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                1. Timestamp to Human Date
              </span>
              <input
                type="text"
                value={inputTs}
                onChange={(e) => setInputTs(e.target.value)}
                placeholder="e.g. 1700000000"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-mono"
              />
              {parsedDateFromTs() && (
                <div className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-200">
                  <div>
                    <span className="font-semibold text-slate-500">Local Time: </span>
                    <span className="font-mono font-bold">{parsedDateFromTs()?.local}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">UTC Time: </span>
                    <span className="font-mono font-bold">{parsedDateFromTs()?.utc}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">ISO 8601: </span>
                    <span className="font-mono">{parsedDateFromTs()?.iso}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Date to Timestamp */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                2. Human Date to Timestamp
              </span>
              <input
                type="datetime-local"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-mono"
              />
              {parsedTsFromDate() && (
                <div className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-200">
                  <div>
                    <span className="font-semibold text-slate-500">Epoch Seconds: </span>
                    <span className="font-mono font-bold text-indigo-600 select-all">
                      {parsedTsFromDate()?.sec}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">Epoch Milliseconds: </span>
                    <span className="font-mono font-bold text-indigo-600 select-all">
                      {parsedTsFromDate()?.ms}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
