import { pickByLocale, slugify } from './utils';
import type { SearchableContent } from '../types/content';

export function buildSearchIndex(locale: string, content: SearchableContent[]) {
  return content.map((item) => ({
    ...item,
    title: pickByLocale(item.title, locale) as string,
    summary: pickByLocale(item.summary, locale) as string,
    keywords: item.keywords?.map((keyword) => (typeof keyword === 'string' ? keyword : pickByLocale(keyword, locale) as string)) ?? []
  }));
}

export function searchContent(query: string, index: ReturnType<typeof buildSearchIndex>) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return index;
  }

  return index.filter((item) => {
    const haystack = [item.title, item.summary, item.slug, ...(item.keywords ?? [])]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

export function enrichWithSlug(items: SearchableContent[]) {
  return items.map((item) => ({
    ...item,
    slug: item.slug ?? slugify(typeof item.title === 'string' ? item.title : item.title.en ?? item.title.pt)
  }));
}
