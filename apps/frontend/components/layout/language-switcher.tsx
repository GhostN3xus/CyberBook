'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { languages } from '../../app/i18n/settings';
import { Globe } from 'lucide-react';
import { useState } from 'react';

interface Props {
  locale: string;
}

export function LanguageSwitcher({ locale }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const currentPath = pathname.split('/').slice(2).join('/');

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center space-x-1 rounded px-2 py-1 text-sm text-slate-200 hover:text-brand-neon"
      >
        <Globe className="h-4 w-4" />
        <span className="uppercase">{locale}</span>
      </button>
      {open && (
        <ul className="absolute right-0 mt-2 w-32 rounded-md border border-slate-700 bg-brand-dark shadow-lg">
          {languages.map((lng) => (
            <li key={lng}>
              <Link
                href={`/${lng}/${currentPath}`.replace(/\/$/, '') || `/${lng}`}
                className="block px-3 py-2 text-sm text-slate-200 hover:bg-brand-dark/60"
                onClick={() => setOpen(false)}
              >
                {lng.toUpperCase()}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
