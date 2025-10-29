'use client';

import { useState, useMemo } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from 'cmdk';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { buildSearchIndex, searchContent } from '../../lib/search';
import type { SearchableContent } from '../../types/content';

interface Props {
  locale: string;
  content: SearchableContent[];
  placeholder?: string;
  emptyText?: string;
}

export function SearchDialog({ locale, content, placeholder = 'Search...', emptyText = 'No results found.' }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const index = useMemo(() => buildSearchIndex(locale, content), [locale, content]);
  const results = useMemo(() => searchContent(query, index), [query, index]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center space-x-2 rounded border border-slate-700 bg-brand-dark/80 px-4 py-2 text-sm text-slate-300 hover:border-brand-neon"
      >
        <Search className="h-4 w-4" />
        <span>Search</span>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-6">
          <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-slate-700 bg-brand-dark shadow-xl">
            <Command>
              <CommandInput value={query} onValueChange={setQuery} placeholder={placeholder} />
              <CommandList>
                <CommandEmpty>{emptyText}</CommandEmpty>
                <CommandGroup heading="Results">
                  {results.map((item) => (
                    <CommandItem key={item.slug} onSelect={() => setOpen(false)}>
                      <Link href={`/${locale}/${item.slug}`} className="flex w-full flex-col text-left">
                        <span className="text-sm font-semibold text-slate-100">{item.title}</span>
                        <span className="text-xs text-slate-400">{item.summary}</span>
                      </Link>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
            <div className="border-t border-slate-700 bg-brand-dark/60 px-4 py-2 text-right">
              <button className="text-xs text-slate-400" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
