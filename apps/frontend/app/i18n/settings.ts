export const languages = ['pt', 'en'] as const;
export type AppLocale = (typeof languages)[number];

export const fallbackLng: AppLocale = 'pt';
export const defaultNS = 'common';

export const namespaces = [
  'common',
  'home',
  'about',
  'checklists',
  'guides',
  'cwe',
  'tutorials',
  'best-practices',
  'tools',
  'docs',
  'news',
  'auth',
  'admin',
  'contact',
  'legal'
] as const;
