import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { createTranslation } from '../../i18n';
import { academyModules } from '../../../data/academy';
import { pickByLocale } from '../../../lib/utils';

export default async function AcademyPage({ params }: { params: { locale: 'pt' | 'en' } }) {
  const { t } = await createTranslation(params.locale, 'academy');

  return (
    <section className="space-y-12">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold text-brand-neon">{t('title')}</h1>
        <p className="max-w-3xl text-lg text-slate-300">{t('intro')}</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {academyModules.map((module) => {
          const localizedTitle = pickByLocale(module.title, params.locale) as string;
          const localizedSummary = pickByLocale(module.summary, params.locale) as string;

          return (
            <article key={module.slug} className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 text-xs text-brand-neon">
                  <span className="rounded-full border border-brand-neon/60 px-3 py-1">
                    {t('labels.duration')}: {module.durationHours}h
                  </span>
                  <span className="rounded-full border border-brand-neon/60 px-3 py-1">
                    {t('labels.difficulty')}: {t(`difficulty.${module.difficulty}` as const)}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-slate-100">{localizedTitle}</h2>
                <p className="text-sm text-slate-300">{localizedSummary}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-brand-neon">{t('labels.lessons')}</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  {module.lessons.map((lesson) => (
                    <li key={lesson.id} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand-neon" aria-hidden />
                      <span>{pickByLocale(lesson.title, params.locale) as string}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto flex justify-end">
                <Link
                  href={`/${params.locale}/${module.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-brand-neon hover:text-brand-neon/80"
                >
                  {t('labels.cta')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
