import { useState } from 'react';
import { Copy, Check, Trash2, Download, AlertCircle, CheckCircle2, Code, ArrowRightLeft } from 'lucide-react';
import { ToolDefinition } from '../../types';
import { triggerDownload } from '../../utils/imageUtils';

interface Props {
  tool: ToolDefinition;
}

export default function DevTools({ tool }: Props) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // JSON indentation
  const [indent, setIndent] = useState<number | string>(2);

  // Base64 & URL mode
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (content: string, filename: string, type = 'text/plain') => {
    const blob = new Blob([content], { type: `${type};charset=utf-8` });
    triggerDownload(blob, filename);
  };

  // JSON Formatter / Beautifier
  const handleFormatJson = (spacing: number | string) => {
    if (!input.trim()) return;
    setError(null);
    try {
      const parsed = JSON.parse(input);
      const spaceVal = spacing === 'tab' ? '\t' : Number(spacing);
      const formatted = JSON.stringify(parsed, null, spaceVal);
      setOutput(formatted);
    } catch (err: any) {
      setError(err?.message || 'Invalid JSON syntax');
      setOutput('');
    }
  };

  // JSON Validator
  const handleValidateJson = () => {
    if (!input.trim()) return;
    try {
      JSON.parse(input);
      setError(null);
      setOutput('VALID_JSON');
    } catch (err: any) {
      setError(err?.message || 'Invalid JSON syntax');
      setOutput('INVALID_JSON');
    }
  };

  // JSON Minifier
  const handleMinifyJson = () => {
    if (!input.trim()) return;
    setError(null);
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
    } catch (err: any) {
      setError(err?.message || 'Invalid JSON syntax');
      setOutput('');
    }
  };

  // Base64 Encode / Decode
  const handleBase64Process = (str: string, currentMode: 'encode' | 'decode') => {
    setInput(str);
    setError(null);
    if (!str.trim()) {
      setOutput('');
      return;
    }
    try {
      if (currentMode === 'encode') {
        // UTF-8 safe encode
        const encoded = btoa(unescape(encodeURIComponent(str)));
        setOutput(encoded);
      } else {
        // UTF-8 safe decode
        const decoded = decodeURIComponent(escape(atob(str.trim())));
        setOutput(decoded);
      }
    } catch (err: any) {
      setError(currentMode === 'decode' ? 'Invalid Base64 string format' : err.message);
      setOutput('');
    }
  };

  // URL Encode / Decode
  const handleUrlProcess = (str: string, currentMode: 'encode' | 'decode') => {
    setInput(str);
    setError(null);
    if (!str.trim()) {
      setOutput('');
      return;
    }
    try {
      if (currentMode === 'encode') {
        setOutput(encodeURIComponent(str));
      } else {
        setOutput(decodeURIComponent(str));
      }
    } catch (err: any) {
      setError(err.message || 'Malformed URI sequence');
      setOutput('');
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-7 shadow-xs space-y-6">
      {/* JSON FORMATTER */}
      {tool.id === 'json-formatter' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Indentation:</span>
              {[2, 4, 'tab'].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setIndent(s);
                    handleFormatJson(s);
                  }}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg border cursor-pointer ${
                    indent === s
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {s === 'tab' ? 'Tabs' : `${s} Spaces`}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleFormatJson(indent)}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                Beautify JSON
              </button>
              <button
                onClick={() => {
                  setInput('');
                  setOutput('');
                  setError(null);
                }}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer"
                title="Clear"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-bold text-slate-600 block mb-1">Input JSON</span>
              <textarea
                rows={12}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setError(null);
                }}
                placeholder='Paste raw or unformatted JSON here (e.g. {"name":"SmartTools","active":true})...'
                className="w-full p-3 bg-slate-50/50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 focus:outline-indigo-500"
              />
            </div>

            <div>
              <span className="text-xs font-bold text-indigo-700 block mb-1">Formatted Output</span>
              <textarea
                rows={12}
                readOnly
                value={output}
                placeholder="Beautified JSON will render here..."
                className="w-full p-3 bg-slate-100 border border-indigo-200 rounded-xl font-mono text-xs text-slate-800 focus:outline-hidden"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs sm:text-sm rounded-xl border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={() => handleCopy(output)}
              disabled={!output}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
            <button
              onClick={() => handleDownload(output, 'data.json', 'application/json')}
              disabled={!output}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .json</span>
            </button>
          </div>
        </div>
      )}

      {/* JSON VALIDATOR */}
      {tool.id === 'json-validator' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-xs font-bold text-slate-600">JSON Syntax Verification Engine</span>
            <button
              onClick={handleValidateJson}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-2xs cursor-pointer"
            >
              Validate Now
            </button>
          </div>

          <textarea
            rows={10}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setOutput('');
              setError(null);
            }}
            placeholder="Paste your JSON payload here to validate syntax compliance with RFC 8259..."
            className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-xl font-mono text-xs sm:text-sm text-slate-800 focus:outline-indigo-500"
          />

          {output === 'VALID_JSON' && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold text-sm">Valid JSON!</div>
                <div className="text-xs text-emerald-700">No syntax errors found. Ready for production usage.</div>
              </div>
            </div>
          )}

          {output === 'INVALID_JSON' && error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-sm">Invalid JSON Syntax</div>
                <div className="text-xs font-mono text-red-700 mt-1">{error}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* JSON MINIFIER */}
      {tool.id === 'json-minifier' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-xs font-bold text-slate-600">Compress JSON by stripping all whitespace and line breaks</span>
            <button
              onClick={handleMinifyJson}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-2xs cursor-pointer"
            >
              Minify JSON
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                <span>Input JSON</span>
                {input && <span>{input.length} characters</span>}
              </div>
              <textarea
                rows={10}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste formatted JSON here..."
                className="w-full p-3 bg-slate-50/50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 focus:outline-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-indigo-700 mb-1">
                <span>Minified Output</span>
                {output && (
                  <span className="text-emerald-600 font-bold">
                    {output.length} characters ({Math.max(0, Math.round(((input.length - output.length) / input.length) * 100))}% smaller)
                  </span>
                )}
              </div>
              <textarea
                rows={10}
                readOnly
                value={output}
                placeholder="Compact single-line JSON will appear here..."
                className="w-full p-3 bg-slate-100 border border-indigo-200 rounded-xl font-mono text-xs text-slate-800 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => handleCopy(output)}
              disabled={!output}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Minified'}</span>
            </button>
          </div>
        </div>
      )}

      {/* BASE64 ENCODER / DECODER */}
      {tool.id === 'base64-encoder-decoder' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-xs font-semibold">
              <button
                onClick={() => {
                  setMode('encode');
                  handleBase64Process(input, 'encode');
                }}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  mode === 'encode' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                Text to Base64 (Encode)
              </button>
              <button
                onClick={() => {
                  setMode('decode');
                  handleBase64Process(input, 'decode');
                }}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  mode === 'decode' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                Base64 to Text (Decode)
              </button>
            </div>

            <button
              onClick={() => {
                setInput('');
                setOutput('');
                setError(null);
              }}
              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-bold text-slate-600 block mb-1">
                {mode === 'encode' ? 'Input Plain Text' : 'Input Base64 String'}
              </span>
              <textarea
                rows={10}
                value={input}
                onChange={(e) => handleBase64Process(e.target.value, mode)}
                placeholder={mode === 'encode' ? 'Enter plain text...' : 'Paste Base64 string...'}
                className="w-full p-3 bg-slate-50/50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 focus:outline-indigo-500"
              />
            </div>

            <div>
              <span className="text-xs font-bold text-indigo-700 block mb-1">
                {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
              </span>
              <textarea
                rows={10}
                readOnly
                value={output}
                placeholder="Converted output..."
                className="w-full p-3 bg-slate-100 border border-indigo-200 rounded-xl font-mono text-xs text-slate-800 focus:outline-hidden"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs sm:text-sm rounded-xl border border-red-200">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={() => handleCopy(output)}
              disabled={!output}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Output'}</span>
            </button>
          </div>
        </div>
      )}

      {/* URL ENCODER / DECODER */}
      {tool.id === 'url-encoder-decoder' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-xs font-semibold">
              <button
                onClick={() => {
                  setMode('encode');
                  handleUrlProcess(input, 'encode');
                }}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  mode === 'encode' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                URL Encode
              </button>
              <button
                onClick={() => {
                  setMode('decode');
                  handleUrlProcess(input, 'decode');
                }}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  mode === 'decode' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                URL Decode
              </button>
            </div>

            <button
              onClick={() => {
                setInput('');
                setOutput('');
                setError(null);
              }}
              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-bold text-slate-600 block mb-1">
                {mode === 'encode' ? 'URL or Parameter to Encode' : 'Encoded URL to Decode'}
              </span>
              <textarea
                rows={8}
                value={input}
                onChange={(e) => handleUrlProcess(e.target.value, mode)}
                placeholder={mode === 'encode' ? 'https://example.com/search?q=smart tools&cat=all' : 'https%3A%2F%2Fexample.com...'}
                className="w-full p-3 bg-slate-50/50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 focus:outline-indigo-500"
              />
            </div>

            <div>
              <span className="text-xs font-bold text-indigo-700 block mb-1">Output</span>
              <textarea
                rows={8}
                readOnly
                value={output}
                placeholder="Converted URL string..."
                className="w-full p-3 bg-slate-100 border border-indigo-200 rounded-xl font-mono text-xs text-slate-800 focus:outline-hidden"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs sm:text-sm rounded-xl border border-red-200">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={() => handleCopy(output)}
              disabled={!output}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Output'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
