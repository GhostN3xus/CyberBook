import { createTranslation } from '../../i18n';
import { cweCatalog } from '../../../data/cwe';

export default async function CweLibraryPage({ params }: { params: { locale: 'pt' | 'en' } }) {
  const { t } = await createTranslation(params.locale, 'cwe');

  return (
    <section className="space-y-10">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold text-brand-neon">{t('title')}</h1>
        <p className="text-lg text-slate-300">{t('description')}</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {cweCatalog.map((item) => (
          <article key={item.cweId} className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="text-xl font-semibold text-brand-neon">
              {typeof item.title === 'string' ? item.title : item.title[params.locale]}
            </h2>
            <p className="text-sm text-slate-300">
              {typeof item.summary === 'string' ? item.summary : item.summary[params.locale]}
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-slate-400">
              <span className="rounded-full border border-brand-neon/40 px-3 py-1">{item.cweId}</span>
              <span className="rounded-full border border-brand-neon/40 px-3 py-1">OWASP: {item.owaspMapping.join(', ')}</span>
            </div>
            <p className="text-sm text-slate-300">{item.mitigation[params.locale]}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
