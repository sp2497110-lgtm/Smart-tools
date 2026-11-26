import { useEffect } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, HelpCircle, ShieldCheck, Sparkles } from 'lucide-react';
import type { SeoLandingPage as PageData } from '../data/seoLandingPages';
import { getSeoLandingPagesForTool } from '../data/seoLandingPages';

interface Props {
  page: PageData;
  onNavigate: (path: string) => void;
}

export default function SeoLandingPage({ page, onNavigate }: Props) {
  const relatedPages = getSeoLandingPagesForTool(page.toolId).filter((item) => item.id !== page.id).slice(0, 6);

  useEffect(() => {
    document.title = page.title;
    const setMeta = (selector: string, key: string, value: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        const match = selector.match(/\[(name|property)="([^"]+)"\]/);
        if (match) element.setAttribute(match[1], match[2]);
        document.head.appendChild(element);
      }
      element.setAttribute(key, value);
    };
    setMeta('meta[name="description"]', 'content', page.description);
    setMeta('meta[name="robots"]', 'content', 'index, follow, max-image-preview:large');
    setMeta('meta[property="og:title"]', 'content', page.title);
    setMeta('meta[property="og:description"]', 'content', page.description);
    setMeta('meta[property="og:url"]', 'content', `https://toolzy.online${page.path}`);
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `https://toolzy.online${page.path}`;
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: page.title,
      description: page.description,
      url: `https://toolzy.online${page.path}`,
      about: { '@type': 'SoftwareApplication', name: page.toolName, applicationCategory: 'UtilitiesApplication' },
      mainEntity: {
        '@type': 'FAQPage',
        mainEntity: page.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: { '@type': 'Answer', text: faq.a },
        })),
      },
    };
    let script = document.getElementById('seo-landing-jsonld');
    if (!script) {
      script = document.createElement('script');
      script.id = 'seo-landing-jsonld';
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);
    return () => {
      document.getElementById('seo-landing-jsonld')?.remove();
    };
  }, [page]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
        <button onClick={() => onNavigate('/')} className="hover:text-indigo-600">Home</button>
        <span>/</span>
        <button onClick={() => onNavigate(page.toolPath)} className="hover:text-indigo-600">{page.toolName}</button>
        <span>/</span>
        <span className="text-slate-700">Guide</span>
      </nav>

      <section className="overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6 text-white shadow-xl sm:p-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold text-indigo-100">
          <Sparkles className="h-3.5 w-3.5" /> TOOLZY SEARCH GUIDE
        </div>
        <h1 className="max-w-3xl text-3xl font-black tracking-tight sm:text-4xl">{page.h1}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-indigo-100 sm:text-base">{page.intro}</p>
        <button onClick={() => onNavigate(page.toolPath)} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-indigo-950 shadow-lg transition hover:-translate-y-0.5">
          Open {page.toolName} <ArrowRight className="h-4 w-4" />
        </button>
        <p className="mt-3 text-xs text-indigo-200">Free browser-based tool · No account required</p>
      </section>

      <section className="mt-7 grid gap-5 md:grid-cols-[1.3fr_0.7fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-2 text-indigo-700"><BookOpen className="h-5 w-5" /><span className="text-xs font-extrabold uppercase tracking-wider">Practical guide</span></div>
          <h2 className="mt-3 text-xl font-extrabold text-slate-900 sm:text-2xl">{page.sectionTitle}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">{page.sectionBody}</p>
          <h3 className="mt-7 text-base font-extrabold text-slate-900">Common use cases</h3>
          <ul className="mt-3 space-y-3">
            {page.useCases.map((item, index) => <li key={index} className="flex gap-3 text-sm leading-6 text-slate-600"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />{item}</li>)}
          </ul>
        </article>
        <aside className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-6">
          <div className="flex items-center gap-2 text-emerald-800"><ShieldCheck className="h-5 w-5" /><h2 className="font-extrabold">Before you start</h2></div>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-emerald-950/80">
            <li>• Keep an original copy of important files.</li>
            <li>• Check the output before submitting or sharing.</li>
            <li>• Use a modern browser for the best experience.</li>
            <li>• Avoid entering sensitive information unless necessary.</li>
          </ul>
        </aside>
      </section>

      <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-extrabold text-slate-900">How to use {page.toolName}</h2>
        <ol className="mt-5 grid gap-4 sm:grid-cols-2">
          {page.steps.map((step, index) => <li key={index} className="flex gap-3 rounded-xl bg-slate-50 p-4"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-xs font-black text-white">{index + 1}</span><span className="text-sm leading-6 text-slate-700">{step}</span></li>)}
        </ol>
        <button onClick={() => onNavigate(page.toolPath)} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700">Try the tool now <ArrowRight className="h-4 w-4" /></button>
      </section>

      <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-2"><HelpCircle className="h-5 w-5 text-indigo-600" /><h2 className="text-xl font-extrabold text-slate-900">Frequently asked questions</h2></div>
        <div className="mt-5 divide-y divide-slate-100">
          {page.faqs.map((faq, index) => <article key={index} className="py-4 first:pt-0 last:pb-0"><h3 className="font-bold text-slate-900">{faq.q}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{faq.a}</p></article>)}
        </div>
      </section>

      <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-extrabold text-slate-900">More {page.toolName} guides</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {relatedPages.map((item) => <a key={item.id} href={item.path} onClick={(event) => { event.preventDefault(); onNavigate(item.path); }} className="group flex items-center justify-between rounded-xl border border-slate-200 p-4 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50/60 hover:text-indigo-700"><span>{item.keyword}</span><ArrowRight className="h-4 w-4 shrink-0" /></a>)}
        </div>
      </section>
    </main>
  );
}
