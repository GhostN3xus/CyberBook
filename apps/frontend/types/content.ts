export type LocalizedString = {
  pt: string;
  en: string;
};

export interface SearchableContent {
  title: LocalizedString | string;
  summary: LocalizedString | string;
  slug?: string;
  type: 'checklist' | 'guide' | 'tutorial' | 'tool' | 'doc' | 'news' | 'note' | 'use-case' | 'academy-module';
  tags?: string[];
  keywords?: (LocalizedString | string)[];
  metadata?: Record<string, unknown>;
}

export interface VulnerabilityGuide extends SearchableContent {
  cwe: string;
  owasp: string[];
  risk: 'low' | 'medium' | 'high' | 'critical';
  complexity: 'low' | 'medium' | 'high';
  insecureExample: LocalizedString;
  secureExample: LocalizedString;
  remediation: LocalizedString;
  references: {
    label: LocalizedString;
    url: string;
  }[];
}

export interface ToolEntry extends SearchableContent {
  vendor: string;
  category: string;
  pricing: 'open-source' | 'freemium' | 'commercial';
  website: string;
  integrations?: string[];
}
