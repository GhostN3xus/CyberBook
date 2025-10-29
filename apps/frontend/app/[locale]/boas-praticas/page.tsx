import { createTranslation } from '../../i18n';
import { bestPractices } from '../../../data/best-practices';

export default async function BestPracticesPage({ params }: { params: { locale: 'pt' | 'en' } }) {
  const { t } = await createTranslation(params.locale, 'best-practices');

  return (
    <section className="space-y-10">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold text-brand-neon">{t('title')}</h1>
        <p className="text-lg text-slate-300">{t('description')}</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {bestPractices.map((entry) => (
          <article key={entry.slug} className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="text-xl font-semibold text-brand-neon">
              {typeof entry.title === 'string' ? entry.title : entry.title[params.locale]}
            </h2>
            <p className="text-sm text-slate-300">
              {typeof entry.summary === 'string' ? entry.summary : entry.summary[params.locale]}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
