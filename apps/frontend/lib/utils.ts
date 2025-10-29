import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function pickByLocale<T extends Record<'pt' | 'en', unknown>>(input: T, locale: string) {
  if (locale in input) {
    return input[locale as keyof T];
  }
  return input.pt;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}
