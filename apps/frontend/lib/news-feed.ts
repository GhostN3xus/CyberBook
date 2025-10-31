import { newsFeed } from '../data/news';
import type { LocalizedString, SearchableContent } from '../types/content';
import { sanitizePlainText, sanitizeUrl } from './sanitization';

function sanitizeLocalizedString(input: LocalizedString | string): LocalizedString | string {
  if (typeof input === 'string') {
    return sanitizePlainText(input);
  }

  return {
    pt: sanitizePlainText(input.pt),
    en: sanitizePlainText(input.en)
  };
}

function sanitizeMetadata(metadata: SearchableContent['metadata']): SearchableContent['metadata'] {
  if (!metadata) {
    return undefined;
  }

  const sanitizedEntries = Object.entries(metadata).reduce<Record<string, unknown>>((acc, [key, value]) => {
    if (typeof value === 'string') {
      const normalizedKey = key.toLowerCase();
      const sanitizedValue =
        normalizedKey.includes('url') || normalizedKey === 'link'
          ? sanitizeUrl(value)
          : sanitizePlainText(value);

      if (sanitizedValue !== undefined && sanitizedValue !== '') {
        acc[key] = sanitizedValue;
      }
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});

  return sanitizedEntries;
}

export function getSanitizedNewsFeed(): SearchableContent[] {
  return newsFeed.map((entry) => ({
    ...entry,
    title: sanitizeLocalizedString(entry.title),
    summary: sanitizeLocalizedString(entry.summary),
    keywords: entry.keywords?.map((keyword) => sanitizeLocalizedString(keyword)),
    metadata: sanitizeMetadata(entry.metadata)
  }));
}
