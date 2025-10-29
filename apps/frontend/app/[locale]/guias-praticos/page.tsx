import { createTranslation } from '../../i18n';
import { tutorials } from '../../../data/tutorials';

export default async function PracticalGuidesPage({ params }: { params: { locale: 'pt' | 'en' } }) {
  const { t } = await createTranslation(params.locale, 'tutorials');

  return (
    <section className="space-y-10">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold text-brand-neon">{t('title')}</h1>
        <p className="text-lg text-slate-300">{t('description')}</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {tutorials.map((tutorial) => (
          <article key={tutorial.slug} className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="text-xl font-semibold text-brand-neon">
              {typeof tutorial.title === 'string' ? tutorial.title : tutorial.title[params.locale]}
            </h2>
            <p className="text-sm text-slate-300">
              {typeof tutorial.summary === 'string' ? tutorial.summary : tutorial.summary[params.locale]}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
