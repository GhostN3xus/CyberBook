'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { ShieldHalf, Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { LanguageSwitcher } from './language-switcher';
import { ThemeToggle } from '../ui/theme-toggle';
import { cn } from '../../lib/utils';

interface Props {
  locale: string;
}

export function SiteHeader({ locale }: Props) {
  const pathname = usePathname();
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const { setTheme } = useTheme();

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }, [setTheme]);

  const navItems = [
    { href: `/${locale}`, label: t('navigation.home') },
    { href: `/${locale}/sobre`, label: t('navigation.about') },
    { href: `/${locale}/checklists/owasp-top-10`, label: t('navigation.owaspTop10') },
    { href: `/${locale}/checklists/owasp-api-top-10`, label: t('navigation.owaspApi') },
    { href: `/${locale}/guias`, label: t('navigation.guides') },
    { href: `/${locale}/biblioteca-cwe`, label: t('navigation.cwe') },
    { href: `/${locale}/guias-praticos`, label: t('navigation.tutorials') },
    { href: `/${locale}/boas-praticas`, label: t('navigation.bestPractices') },
    { href: `/${locale}/ferramentas`, label: t('navigation.tools') },
    { href: `/${locale}/documentacoes`, label: t('navigation.docs') },
    { href: `/${locale}/noticias`, label: t('navigation.news') },
    { href: `/${locale}/contato`, label: t('navigation.contact') }
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-brand-dark/80 border-b border-slate-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href={`/${locale}`} className="flex items-center space-x-3 text-lg font-semibold">
          <ShieldHalf className="h-6 w-6 text-brand-neon" />
          <span>{t('siteTitle')}</span>
        </Link>
        <nav className="hidden items-center space-x-4 text-sm font-medium md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded px-2 py-1 transition hover:text-brand-neon',
                pathname === item.href ? 'text-brand-neon' : 'text-slate-200'
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link href={`/${locale}/auth`} className="text-brand-neon">
            {t('navigation.login')}
          </Link>
          <LanguageSwitcher locale={locale} />
          <ThemeToggle />
        </nav>
        <div className="flex items-center space-x-2 md:hidden">
          <LanguageSwitcher locale={locale} />
          <ThemeToggle />
          <Button variant="ghost" className="md:hidden" onClick={() => setOpen((prev) => !prev)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {open && (
        <div className="space-y-2 border-t border-slate-800 bg-brand-dark px-6 py-4 md:hidden">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="block text-slate-200" onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link href={`/${locale}/auth`} className="block text-brand-neon" onClick={() => setOpen(false)}>
            {t('navigation.login')}
          </Link>
        </div>
      )}
    </header>
  );
}
