import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SEO_LANDING_PAGES } from '../src/data/seoLandingPages';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const BASE_URL = 'https://toolzy.online';

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const staticMarkup = (page: (typeof SEO_LANDING_PAGES)[number]) => `
<div id="seo-prerender" style="max-width:1040px;margin:36px auto;padding:0 20px;font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#0f172a">
  <main>
    <p style="font-size:12px;font-weight:700;letter-spacing:.12em;color:#4f46e5">TOOLZY SEARCH GUIDE</p>
    <h1 style="font-size:clamp(30px,5vw,48px);line-height:1.12;margin:14px 0">${escapeHtml(page.h1)}</h1>
    <p style="font-size:17px;line-height:1.8;color:#475569;max-width:760px">${escapeHtml(page.intro)}</p>
    <p style="margin:24px 0"><a href="${page.toolPath}" style="display:inline-block;background:#4f46e5;color:white;text-decoration:none;padding:13px 20px;border-radius:12px;font-weight:700">Open ${escapeHtml(page.toolName)}</a></p>
    <section style="border:1px solid #e2e8f0;border-radius:18px;padding:24px;margin:24px 0">
      <h2 style="font-size:24px;margin:0 0 12px">${escapeHtml(page.sectionTitle)}</h2>
      <p style="line-height:1.8;color:#475569">${escapeHtml(page.sectionBody)}</p>
      <h3 style="font-size:18px;margin:22px 0 10px">Common use cases</h3>
      <ul>${page.useCases.map((item) => `<li style="margin:9px 0;line-height:1.6">${escapeHtml(item)}</li>`).join('')}</ul>
    </section>
    <section style="border:1px solid #e2e8f0;border-radius:18px;padding:24px;margin:24px 0">
      <h2 style="font-size:24px;margin:0 0 12px">How to use ${escapeHtml(page.toolName)}</h2>
      <ol>${page.steps.map((item) => `<li style="margin:9px 0;line-height:1.6">${escapeHtml(item)}</li>`).join('')}</ol>
    </section>
    <section style="border:1px solid #e2e8f0;border-radius:18px;padding:24px;margin:24px 0">
      <h2 style="font-size:24px;margin:0 0 12px">Frequently asked questions</h2>
      ${page.faqs.map((faq) => `<article style="padding:12px 0;border-bottom:1px solid #e2e8f0"><h3 style="font-size:17px">${escapeHtml(faq.q)}</h3><p style="line-height:1.7;color:#475569">${escapeHtml(faq.a)}</p></article>`).join('')}
    </section>
  </main>
</div>`;

const baseHtml = await readFile(path.join(DIST, 'index.html'), 'utf8');
const urls: string[] = [];\nif (SEO_LANDING_PAGES.length !== 450) throw new Error(`Expected 450 SEO landing pages, received ${SEO_LANDING_PAGES.length}`);\nconst uniquePaths = new Set(SEO_LANDING_PAGES.map((page) => page.path));\nif (uniquePaths.size !== SEO_LANDING_PAGES.length) throw new Error('Duplicate SEO landing page paths detected');
for (const page of SEO_LANDING_PAGES) {
  const outDir = path.join(DIST, page.path.replace(/^\//, ''));
  const normalizedDir = path.resolve(outDir);
  await mkdir(normalizedDir, { recursive: true });
  const canonical = `${BASE_URL}${page.path}`;
  let html = baseHtml
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(page.title)}</title>`)
    .replace(/<meta\s+name="description"[^>]*content="[^"]*"[^>]*>/i, `<meta name="description" content="${escapeHtml(page.description)}" />`)
    .replace(/<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta\s+property="og:title"[^>]*>/i, `<meta property="og:title" content="${escapeHtml(page.title)}" />`)
    .replace(/<meta\s+property="og:description"[^>]*>/i, `<meta property="og:description" content="${escapeHtml(page.description)}" />`)
    .replace(/<meta\s+property="og:url"[^>]*>/i, `<meta property="og:url" content="${canonical}" />`)
    .replace('<div id="root"></div>', `${staticMarkup(page)}\n    <div id="root"></div>`);
  html = html.replace(/<meta\\s+name="robots"[^>]*>/i, `<meta name="robots" content="index,follow,max-image-preview:large" />`);
  await writeFile(path.join(normalizedDir, 'index.html'), html, 'utf8');
  urls.push(canonical);
}

const oldSitemap = await readFile(path.join(ROOT, 'sitemap.xml'), 'utf8');
const existing = [...oldSitemap.matchAll(/<loc>(https:\/\/toolzy\.online[^<]+)<\/loc>/g)].map((match) => match[1]);
const allUrls = [...new Set([...existing, ...urls])];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allUrls.map((url) => `  <url><loc>${url}</loc><changefreq>monthly</changefreq><priority>${url === BASE_URL + '/' ? '1.0' : '0.6'}</priority></url>`).join('\n')}\n</urlset>\n`;
await writeFile(path.join(DIST, 'sitemap.xml'), sitemap, 'utf8');
const robots = await readFile(path.join(ROOT, 'robots.txt'), 'utf8');
await writeFile(path.join(DIST, 'robots.txt'), robots, 'utf8');
console.log(`Generated ${SEO_LANDING_PAGES.length} crawlable landing pages and ${allUrls.length} sitemap URLs.`);
