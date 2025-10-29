import { createTranslation } from '../../i18n';
import { tools } from '../../../data/tools';

export default async function ToolsPage({ params }: { params: { locale: 'pt' | 'en' } }) {
  const { t } = await createTranslation(params.locale, 'tools');

  return (
    <section className="space-y-10">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold text-brand-neon">{t('title')}</h1>
        <p className="text-lg text-slate-300">{t('description')}</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {tools.map((tool) => (
          <article key={tool.website} className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <div>
              <h2 className="text-xl font-semibold text-brand-neon">
                {typeof tool.title === 'string' ? tool.title : tool.title[params.locale]}
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                {typeof tool.summary === 'string' ? tool.summary : tool.summary[params.locale]}
              </p>
            </div>
            <div className="mt-4 space-y-1 text-xs text-slate-400">
              <p>{tool.category} · {tool.pricing}</p>
              <p>{tool.integrations?.join(', ')}</p>
              <a href={tool.website} className="text-brand-neon" target="_blank" rel="noreferrer">
                {tool.website}
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
