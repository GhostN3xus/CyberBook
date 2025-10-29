import { createTranslation } from '../../i18n';
import { officialDocs } from '../../../data/docs';

export default async function DocsPage({ params }: { params: { locale: 'pt' | 'en' } }) {
  const { t } = await createTranslation(params.locale, 'docs');

  return (
    <section className="space-y-10">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold text-brand-neon">{t('title')}</h1>
        <p className="text-lg text-slate-300">{t('description')}</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {officialDocs.map((doc) => (
          <article key={doc.slug} className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="text-xl font-semibold text-brand-neon">
              {typeof doc.title === 'string' ? doc.title : doc.title[params.locale]}
            </h2>
            <p className="text-sm text-slate-300">
              {typeof doc.summary === 'string' ? doc.summary : doc.summary[params.locale]}
            </p>
            <a href={doc.metadata?.url as string} className="text-sm text-brand-neon" target="_blank" rel="noreferrer">
              {doc.metadata?.url}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
