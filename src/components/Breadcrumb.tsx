import React, { useEffect } from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { CATEGORIES } from '../data/toolsData';
import { ToolDefinition } from '../types';

interface BreadcrumbProps {
  tool: ToolDefinition;
  onNavigate: (path: string) => void;
}

export default function Breadcrumb({ tool, onNavigate }: BreadcrumbProps) {
  const categoryObj = CATEGORIES.find((c) => c.id === tool.category);
  const categoryName = categoryObj ? categoryObj.label : tool.category;

  useEffect(() => {
    // Inject BreadcrumbList JSON-LD schema
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: typeof window !== 'undefined' ? window.location.origin : 'https://smarttools.app',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: categoryName,
          item: `${typeof window !== 'undefined' ? window.location.origin : 'https://smarttools.app'}#cat-${tool.category}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: tool.name,
          item: typeof window !== 'undefined' ? window.location.href : `https://smarttools.app${tool.path}`,
        },
      ],
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'breadcrumb-jsonld';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById('breadcrumb-jsonld');
      if (existing) existing.remove();
    };
  }, [tool, categoryName]);

  return (
    <nav aria-label="Breadcrumb" className="py-3 text-xs sm:text-sm text-slate-500">
      <ol className="flex items-center flex-wrap gap-1.5 sm:gap-2">
        <li>
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-1 hover:text-indigo-600 transition-colors cursor-pointer"
            id="breadcrumb-home-link"
          >
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span>Home</span>
          </button>
        </li>
        <li className="text-slate-300">
          <ChevronRight className="w-3.5 h-3.5" />
        </li>
        <li>
          <button
            onClick={() => onNavigate(`/?category=${tool.category}`)}
            className="hover:text-indigo-600 transition-colors cursor-pointer capitalize"
            id="breadcrumb-category-link"
          >
            {categoryName}
          </button>
        </li>
        <li className="text-slate-300">
          <ChevronRight className="w-3.5 h-3.5" />
        </li>
        <li className="text-slate-800 font-medium truncate max-w-[200px] sm:max-w-none" aria-current="page">
          {tool.name}
        </li>
      </ol>
    </nav>
  );
}
