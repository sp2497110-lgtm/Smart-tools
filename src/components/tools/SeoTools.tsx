import { useState, useMemo } from 'react';
import { Copy, Check, Download, Globe, Search, Bot, Network, FileCode } from 'lucide-react';
import { ToolDefinition } from '../../types';
import { triggerDownload } from '../../utils/imageUtils';

interface Props {
  tool: ToolDefinition;
}

export default function SeoTools({ tool }: Props) {
  const [copied, setCopied] = useState(false);

  // META TAG GENERATOR STATE
  const [metaTitle, setMetaTitle] = useState('Smart Tools - Fast, Free & Private Online Tools');
  const [metaDesc, setMetaDesc] = useState(
    'Compress images, merge PDFs, format JSON, count words, and calculate EMI completely in your web browser.'
  );
  const [metaUrl, setMetaUrl] = useState('https://smarttools.app');
  const [metaImage, setMetaImage] = useState('https://smarttools.app/og-cover.png');
  const [metaRobots, setMetaRobots] = useState('index, follow');

  // ROBOTS.TXT STATE
  const [robotsAgent, setRobotsAgent] = useState('*');
  const [robotsDisallows, setRobotsDisallows] = useState('/admin/\n/api/\n/tmp/');
  const [robotsAllows, setRobotsAllows] = useState('/');
  const [robotsSitemap, setRobotsSitemap] = useState('https://smarttools.app/sitemap.xml');
  const [robotsDelay, setRobotsDelay] = useState('');

  // SITEMAP GENERATOR STATE
  const [sitemapDomain, setSitemapDomain] = useState('https://smarttools.app');
  const [sitemapPaths, setSitemapPaths] = useState('/\n/tools/image-compressor.html\n/tools/pdf-merger.html\n/tools/emi-calculator.html\n/tools/qr-code-generator.html');
  const [sitemapFreq, setSitemapFreq] = useState('weekly');
  const [sitemapPriority, setSitemapPriority] = useState('0.8');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (content: string, filename: string, mime = 'text/plain') => {
    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
    triggerDownload(blob, filename);
  };

  // Meta tag code generation
  const generatedMetaHtml = useMemo(() => {
    return `<!-- Primary Meta Tags -->
<title>${metaTitle}</title>
<meta name="title" content="${metaTitle}">
<meta name="description" content="${metaDesc}">
<meta name="robots" content="${metaRobots}">
<link rel="canonical" href="${metaUrl}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${metaUrl}">
<meta property="og:title" content="${metaTitle}">
<meta property="og:description" content="${metaDesc}">
<meta property="og:image" content="${metaImage}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${metaUrl}">
<meta property="twitter:title" content="${metaTitle}">
<meta property="twitter:description" content="${metaDesc}">
<meta property="twitter:image" content="${metaImage}">`;
  }, [metaTitle, metaDesc, metaUrl, metaImage, metaRobots]);

  // Robots.txt generation
  const generatedRobotsTxt = useMemo(() => {
    const lines = [`User-agent: ${robotsAgent}`];
    if (robotsAllows.trim()) {
      robotsAllows.split('\n').filter(Boolean).forEach((p) => lines.push(`Allow: ${p.trim()}`));
    }
    if (robotsDisallows.trim()) {
      robotsDisallows.split('\n').filter(Boolean).forEach((p) => lines.push(`Disallow: ${p.trim()}`));
    }
    if (robotsDelay.trim()) {
      lines.push(`Crawl-delay: ${robotsDelay.trim()}`);
    }
    if (robotsSitemap.trim()) {
      lines.push(`\nSitemap: ${robotsSitemap.trim()}`);
    }
    return lines.join('\n');
  }, [robotsAgent, robotsAllows, robotsDisallows, robotsSitemap, robotsDelay]);

  // Sitemap XML generation
  const generatedSitemapXml = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const base = sitemapDomain.replace(/\/$/, '');
    const urls = sitemapPaths.split('\n').map((p) => p.trim()).filter(Boolean);

    const entries = urls.map((path) => {
      const full = path.startsWith('/') ? `${base}${path}` : `${base}/${path}`;
      return `  <url>
    <loc>${full}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${sitemapFreq}</changefreq>
    <priority>${sitemapPriority}</priority>
  </url>`;
    });

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;
  }, [sitemapDomain, sitemapPaths, sitemapFreq, sitemapPriority]);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-7 shadow-xs space-y-6">
      {/* META TAG GENERATOR */}
      {tool.id === 'meta-tag-generator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Controls */}
            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Page Title</span>
                  <span className={metaTitle.length > 60 ? 'text-amber-600' : 'text-slate-400'}>
                    {metaTitle.length}/60
                  </span>
                </div>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Meta Description</span>
                  <span className={metaDesc.length > 160 ? 'text-amber-600' : 'text-slate-400'}>
                    {metaDesc.length}/160
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={metaDesc}
                  onChange={(e) => setMetaDesc(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Canonical URL</label>
                  <input
                    type="url"
                    value={metaUrl}
                    onChange={(e) => setMetaUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Robots Directive</label>
                  <select
                    value={metaRobots}
                    onChange={(e) => setMetaRobots(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs cursor-pointer"
                  >
                    <option value="index, follow">index, follow (Default)</option>
                    <option value="noindex, follow">noindex, follow</option>
                    <option value="index, nofollow">index, nofollow</option>
                    <option value="noindex, nofollow">noindex, nofollow</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Social Image (og:image)</label>
                <input
                  type="url"
                  value={metaImage}
                  onChange={(e) => setMetaImage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Google SERP Preview Card */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Google Search Result Preview
              </span>
              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1">
                <div className="text-xs text-slate-600 truncate">{metaUrl}</div>
                <div className="text-base text-blue-700 font-medium hover:underline cursor-pointer line-clamp-1">
                  {metaTitle}
                </div>
                <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {metaDesc}
                </div>
              </div>

              {/* Code output */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-700">HTML Code to Paste in &lt;head&gt;</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleCopy(generatedMetaHtml)}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
                <textarea
                  rows={8}
                  readOnly
                  value={generatedMetaHtml}
                  className="w-full p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl border border-slate-800"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ROBOTS.TXT GENERATOR */}
      {tool.id === 'robots-txt-generator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">User-Agent</label>
                <input
                  type="text"
                  value={robotsAgent}
                  onChange={(e) => setRobotsAgent(e.target.value)}
                  placeholder="*"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Disallow Directories (one per line)</label>
                <textarea
                  rows={3}
                  value={robotsDisallows}
                  onChange={(e) => setRobotsDisallows(e.target.value)}
                  placeholder="/admin/&#10;/secret/"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Allow Paths</label>
                <input
                  type="text"
                  value={robotsAllows}
                  onChange={(e) => setRobotsAllows(e.target.value)}
                  placeholder="/"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Sitemap URL</label>
                <input
                  type="url"
                  value={robotsSitemap}
                  onChange={(e) => setRobotsSitemap(e.target.value)}
                  placeholder="https://example.com/sitemap.xml"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-700">Generated robots.txt</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(generatedRobotsTxt)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => handleDownload(generatedRobotsTxt, 'robots.txt')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              <textarea
                rows={12}
                readOnly
                value={generatedRobotsTxt}
                className="w-full p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl border border-slate-800 focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      )}

      {/* SITEMAP XML GENERATOR */}
      {tool.id === 'sitemap-generator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Website Base Domain</label>
                <input
                  type="url"
                  value={sitemapDomain}
                  onChange={(e) => setSitemapDomain(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Page Paths / URLs (one per line)
                </label>
                <textarea
                  rows={5}
                  value={sitemapPaths}
                  onChange={(e) => setSitemapPaths(e.target.value)}
                  placeholder="/&#10;/about.html&#10;/contact.html"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Change Frequency</label>
                  <select
                    value={sitemapFreq}
                    onChange={(e) => setSitemapFreq(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs cursor-pointer"
                  >
                    <option value="always">Always</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Default Priority</label>
                  <select
                    value={sitemapPriority}
                    onChange={(e) => setSitemapPriority(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs cursor-pointer"
                  >
                    <option value="1.0">1.0 (Highest)</option>
                    <option value="0.8">0.8 (Standard)</option>
                    <option value="0.5">0.5 (Neutral)</option>
                    <option value="0.3">0.3 (Low)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-700">Valid XML Output</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(generatedSitemapXml)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => handleDownload(generatedSitemapXml, 'sitemap.xml', 'application/xml')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              <textarea
                rows={12}
                readOnly
                value={generatedSitemapXml}
                className="w-full p-4 bg-slate-900 text-indigo-300 font-mono text-xs rounded-xl border border-slate-800 focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
