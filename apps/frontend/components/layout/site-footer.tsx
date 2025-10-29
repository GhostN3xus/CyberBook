'use client';

import { useTranslation } from 'next-i18next';

interface FooterProps {
  locale: string;
}

export function SiteFooter({ locale }: FooterProps) {
  const { t } = useTranslation('common');
  return (
    <footer className="border-t border-slate-800 bg-brand-dark/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-10 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <span>&copy; {new Date().getFullYear()} {t('siteTitle')}.</span>
        <div className="flex items-center gap-4">
          <span>{t('footer.madeWith')}</span>
          <a href={`/${locale}/politica`} className="text-brand-neon">
            {locale === 'pt' ? 'Privacidade' : 'Privacy'}
          </a>
        </div>
      </div>
    </footer>
  );
}
