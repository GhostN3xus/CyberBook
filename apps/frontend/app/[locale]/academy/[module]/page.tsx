import { notFound } from 'next/navigation';
import { createTranslation } from '../../../i18n';
import { languages } from '../../../i18n/settings';
import { academyModules } from '../../../../data/academy';
import { pickByLocale } from '../../../../lib/utils';

const moduleSlugs = academyModules.map((module) => module.slug.split('/').pop()!);

export function generateStaticParams() {
  return languages.flatMap((locale) => moduleSlugs.map((slug) => ({ locale, module: slug })));
}

export default async function AcademyModulePage({
  params
}: {
  params: { locale: 'pt' | 'en'; module: string };
}) {
  const { t } = await createTranslation(params.locale, 'academy');
  const module = academyModules.find((item) => item.slug.endsWith(params.module));

  if (!module) {
    notFound();
  }

  const localizedTitle = pickByLocale(module.title, params.locale) as string;
  const localizedSummary = pickByLocale(module.summary, params.locale) as string;

  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-brand-neon">{t('title')}</p>
        <h1 className="text-4xl font-bold text-slate-100">{localizedTitle}</h1>
        <p className="max-w-3xl text-lg text-slate-300">{localizedSummary}</p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">{t('labels.duration')}</h2>
          <p className="mt-2 text-2xl font-semibold text-brand-neon">{module.durationHours}h</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">{t('labels.difficulty')}</h2>
          <p className="mt-2 text-2xl font-semibold text-brand-neon">{t(`difficulty.${module.difficulty}` as const)}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Tags</h2>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            {module.tags?.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">{`#${tag}`}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-brand-neon">{t('labels.lessons')}</h2>
        <ul className="space-y-4">
          {module.lessons.map((lesson, index) => (
            <li key={lesson.id} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Lesson {index + 1}</p>
                  <h3 className="text-xl font-semibold text-slate-100">
                    {pickByLocale(lesson.title, params.locale) as string}
                  </h3>
                </div>
                <span className="text-sm text-slate-400">{module.slug.split('/').pop()}-{lesson.id}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
