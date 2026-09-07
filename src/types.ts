export type ToolCategory =
  | 'image'
  | 'pdf'
  | 'text'
  | 'dev'
  | 'calc'
  | 'seo'
  | 'qr'
  | 'converter'
  | 'utility';

export interface ToolFaq {
  q: string;
  a: string;
}

export interface ToolSeo {
  h1: string;
  intro: string;
  howToUse: string[];
  features: string[];
  formula?: string;
  formulaExplanation?: string;
  example?: string;
  faq: ToolFaq[];
}

export interface ToolDefinition {
  id: string;
  name: string;
  path: string; // e.g., '/tools/image-compressor.html'
  category: ToolCategory;
  description: string;
  metaDescription: string;
  iconName: string;
  popular?: boolean;
  targetKb?: number; // Pre-configured target size for image compression (e.g., 20, 50, 100, 200, 500)
  sourceFormat?: string; // For format converters (e.g., 'jpg', 'png', 'webp')
  targetFormat?: string; // For format converters (e.g., 'png', 'jpg', 'webp')
  keywords: string[];
  seo: ToolSeo;
  relatedToolIds: string[];
}

export interface RecentlyUsedTool {
  id: string;
  name: string;
  path: string;
  category: ToolCategory;
  iconName: string;
  lastUsed: number;
}
