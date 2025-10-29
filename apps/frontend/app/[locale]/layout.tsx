import { ReactNode } from 'react';
import { dir } from 'i18next';
import { SiteHeader } from '../../components/layout/site-header';
import { SiteFooter } from '../../components/layout/site-footer';
import { AppProviders } from '../providers';
import { languages } from '../i18n/settings';

export const dynamicParams = false;

export function generateStaticParams() {
  return languages.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  return (
    <AppProviders>
      <div className="min-h-screen" lang={params.locale} dir={dir(params.locale)}>
        <SiteHeader locale={params.locale} />
        <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
        <SiteFooter locale={params.locale} />
      </div>
    </AppProviders>
  );
}
