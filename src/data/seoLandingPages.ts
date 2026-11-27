import { tools } from './toolsData';
import type { ToolDefinition } from '../types';

export interface SeoLandingPage {
  id: string;
  toolId: string;
  toolName: string;
  toolPath: string;
  path: string;
  slug: string;
  keyword: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  sectionTitle: string;
  sectionBody: string;
  useCases: string[];
  steps: string[];
  faqs: { q: string; a: string }[];
}

const INTENTS = [
  { suffix: 'online', title: 'Online tool', heading: 'Complete this task online', body: 'Use this page when you want to complete the task in a browser without installing a separate desktop application.' },
  { suffix: 'free online', title: 'Free online guide', heading: 'A simple free workflow', body: 'This guide explains the practical workflow, what to prepare, and how to check the result before saving it.' },
  { suffix: 'for mobile', title: 'Mobile guide', heading: 'Use it on a phone or tablet', body: 'The workflow is designed around a small screen: choose your input, make the required changes, review the output, and save it to your device.' },
  { suffix: 'without installing software', title: 'Browser-based workflow', heading: 'Work directly in your browser', body: 'A browser-based workflow is useful when you are on a shared computer or do not want to install another application. Keep the original file until you have checked the result.' },
  { suffix: 'step by step', title: 'Step-by-step instructions', heading: 'Follow the steps in order', body: 'Start with a suitable input, use the controls in the tool, inspect the output, and only then download or copy the result.' },
  { suffix: 'for beginners', title: 'Beginner guide', heading: 'Understand the basics first', body: 'If this is your first time doing this task, begin with a small sample. Learn what each setting changes before processing an important file or value.' },
  { suffix: 'examples', title: 'Examples and practical uses', heading: 'Practical examples', body: 'Common situations include preparing content for a website, sharing a file, completing a form, or checking a value. The right settings depend on the final destination.' },
  { suffix: 'privacy and security', title: 'Privacy guide', heading: 'Check privacy before processing', body: 'Avoid entering passwords, payment details, or other sensitive information into tools unless it is genuinely required. For important files, review your browser and device privacy settings.' },
  { suffix: 'troubleshooting', title: 'Troubleshooting guide', heading: 'Fix common problems', body: 'If a result looks wrong, check the input format, file size, selected options, and browser support. Try a small sample to isolate the issue before repeating the full task.' },
  { suffix: 'tips and frequently asked questions', title: 'Tips and FAQs', heading: 'Helpful tips before you begin', body: 'Use clear input data, check the output before sharing it, and keep an unchanged copy of important originals. The answers below cover common questions about this workflow.' },
] as const;

const slugify = (value: string) =>
  value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 72);

const uniqueKeywords = (tool: ToolDefinition): string[] => {
  const source = (tool.keywords || []).map((item) => item.trim()).filter(Boolean);
  const name = tool.name.toLowerCase();
  const candidates = [
    ...source.slice(0, 6),
    `how to use ${name} online free`,
    `${name} on mobile`,
    `${name} without installing software`,
    `${name} step by step`,
  ];
  const result: string[] = [];
  for (const item of candidates) {
    if (!result.some((existing) => existing.toLowerCase() === item.toLowerCase())) result.push(item);
    if (result.length === 10) break;
  }
  while (result.length < 10) result.push(`${name} guide ${result.length + 1}`);
  return result;
};

const buildPagesForTool = (tool: ToolDefinition): SeoLandingPage[] => {
  const keywords = uniqueKeywords(tool);
  const steps = tool.seo?.howToUse?.length ? tool.seo.howToUse : [
    `Open the ${tool.name} workspace.`,
    'Enter or select the information you want to process.',
    'Review the result and make any needed adjustments.',
    'Copy or download the final result.',
  ];
  const featureText = tool.seo?.features?.slice(0, 3) || [];
  return INTENTS.map((intent, index) => {
    const keyword = keywords[index];
    const slug = slugify(keyword) || `guide-${index + 1}`;
    const path = `/search/${tool.id}/${slug}/`;
    const title = `${keyword.replace(/^./, (char) => char.toUpperCase())} | Toolzy`;
    const description = `${keyword}: learn when to use ${tool.name.toLowerCase()}, follow practical steps, and open the free browser-based Toolzy tool.`.slice(0, 158);
    const intentQuestions = [
      { q: `What does ${tool.name.toLowerCase()} help me do?`, a: `${tool.description} Use the main tool link on this guide to try it with your own input.` },
      { q: `Is ${tool.name.toLowerCase()} available online for free?`, a: `Toolzy provides a browser-based ${tool.name.toLowerCase()} workspace without requiring an account. Check the current tool page for any usage limitations.` },
      { q: `Can I use ${tool.name.toLowerCase()} on my phone?`, a: 'Yes. Open the page in a modern mobile browser, use the main tool link, and review the output before saving it.' },
      { q: `Do I need to install software for ${tool.name.toLowerCase()}?`, a: 'No separate desktop installation is required for the browser workflow. A modern browser and a supported input are recommended.' },
      { q: `What is the correct order for using ${tool.name.toLowerCase()}?`, a: steps.slice(0, 3).join(' ') },
      { q: `What should beginners check when using ${tool.name.toLowerCase()}?`, a: 'Start with a small sample, understand each setting, and compare the output with your original input before using it for an important task.' },
      { q: `What are common uses of ${tool.name.toLowerCase()}?`, a: `${tool.description} Common workflows include preparing content, handling files, or checking information before sharing it.` },
      { q: `Is it safe to enter private information into ${tool.name.toLowerCase()}?`, a: 'Do not enter passwords, payment details, or sensitive personal information unless genuinely required. Review the privacy information and keep sensitive data out of unnecessary fields.' },
      { q: `What can I do if ${tool.name.toLowerCase()} does not work as expected?`, a: 'Check the input format, browser support, file size, and selected options. Try a small sample and keep an unchanged copy of the original.' },
      { q: `How can I check the result from ${tool.name.toLowerCase()}?`, a: 'Review the complete output and compare it with the intended result. For important work, verify it independently before submitting or sharing.' },
    ];
    const faq = [
      intentQuestions[index],
      { q: 'Can I use this page on a mobile device?', a: 'Yes. Open the page in a modern mobile browser, use the main tool link, and review the output before saving it.' },
      { q: 'Is the result automatically guaranteed to be correct?', a: 'No automated tool can guarantee every result for every input. Check the output against your requirements and keep an original copy of important information.' },
    ];
    return {
      id: `${tool.id}-${index + 1}`,
      toolId: tool.id,
      toolName: tool.name,
      toolPath: tool.path,
      path,
      slug,
      keyword,
      title,
      description,
      h1: keyword.replace(/^./, (char) => char.toUpperCase()),
      intro: `${tool.description} This focused guide covers the search “${keyword}” and explains a practical way to complete the task with Toolzy.`,
      sectionTitle: intent.heading,
      sectionBody: `${intent.body} ${tool.seo?.intro || tool.description} ${featureText.length ? `Useful details include: ${featureText.join('; ')}.` : ''}`,
      useCases: [
        `Use ${tool.name.toLowerCase()} when you need to complete the specific task described by “${keyword}”.`,
        ...featureText.slice(0, 2),
        'Review the output in the context where you plan to use it before sharing or submitting it.',
      ].slice(0, 4),
      steps: steps.slice(0, 5),
      faqs: faq,
    };
  });
};

export const SEO_LANDING_PAGES: SeoLandingPage[] = tools.flatMap(buildPagesForTool);

export const getSeoLandingPageByPath = (pathname: string): SeoLandingPage | undefined => {
  const normalizedPath = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return SEO_LANDING_PAGES.find((page) => page.path === normalizedPath);
};

export const getSeoLandingPagesForTool = (toolId: string): SeoLandingPage[] =>
  SEO_LANDING_PAGES.filter((page) => page.toolId === toolId);
