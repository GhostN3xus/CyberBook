const TAG_STRIP_REGEX = /<[^>]*>/g;
const CONTROL_CHARS_REGEX = /[\u0000-\u001F\u007F]/g;

export function sanitizePlainText(input: string): string {
  const withoutTags = input.replace(TAG_STRIP_REGEX, '');
  return withoutTags.replace(CONTROL_CHARS_REGEX, '').trim();
}

export function sanitizeUrl(input: string | undefined): string | undefined {
  if (!input) {
    return undefined;
  }

  try {
    const parsed = new URL(input);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
  } catch (error) {
    return undefined;
  }

  return undefined;
}
