'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button className="rounded px-2 py-1 text-sm text-slate-200" aria-label="Toggle theme">
        <Sun className="h-4 w-4" />
      </button>
    );
  }

  const current = theme ?? resolvedTheme ?? 'system';

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      className="rounded px-2 py-1 text-sm text-slate-200 hover:text-brand-neon"
      onClick={() => setTheme(current === 'dark' ? 'light' : 'dark')}
    >
      {current === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
