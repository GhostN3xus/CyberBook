import { createTranslation } from '../i18n';
import { owaspTop10 } from '../../data/owasp-top10';
import { owaspApiTop10 } from '../../data/owasp-api-top10';
import { tools } from '../../data/tools';
import { newsFeed } from '../../data/news';
import { tutorials } from '../../data/tutorials';
import { SearchDialog } from '../../components/search/search-dialog';
import { slugify } from '../../lib/utils';
import type { SearchableContent } from '../../types/content';

export default async function HomePage({ params }: { params: { locale: 'pt' | 'en' } }) {
  const { t, i18n } = await createTranslation(params.locale, ['home', 'common']);

  const searchContent: SearchableContent[] = [
    ...owaspTop10.map((item) => ({ ...item, slug: `checklists/owasp-top-10#${slugify(item.title.en)}` })),
    ...owaspApiTop10.map((item) => ({ ...item, slug: `checklists/owasp-api-top-10#${slugify(item.title.en)}` })),
    ...tools.map((item) => ({ ...item, slug: `ferramentas#${slugify(typeof item.title === 'string' ? item.title : item.title.en)}` })),
    ...tutorials.map((item) => ({ ...item, slug: `guias-praticos#${slugify(typeof item.title === 'string' ? item.title : item.title.en)}` })),
    ...newsFeed.map((item) => ({ ...item, slug: `noticias#${item.slug}` }))
  ];

  return (
    <section className="space-y-16">
      <div className="grid gap-8 rounded-3xl border border-slate-800 bg-gradient-to-br from-brand-dark to-slate-900 px-8 py-16 shadow-xl">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{t('hero.title')}</h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-300">{t('hero.subtitle')}</p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={`/${params.locale}/checklists/owasp-top-10`}
              className="rounded-full bg-brand-neon px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-brand-neon/20 transition hover:scale-105"
            >
              {t('hero.ctaPrimary')}
            </a>
            <a
              href={`/${params.locale}/guias`}
              className="rounded-full border border-brand-neon px-6 py-3 text-sm font-semibold text-brand-neon transition hover:bg-brand-dark/60"
            >
              {t('hero.ctaSecondary')}
            </a>
          </div>
        </div>
        <div className="flex justify-center">
          <SearchDialog
            locale={params.locale}
            content={searchContent}
            placeholder={t('search.placeholder')}
            emptyText={t('search.empty')}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {t('highlights', { returnObjects: true })?.map((item: any, index: number) => (
          <div key={index} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <h3 className="text-xl font-semibold text-brand-neon">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{t('sections.latestNews')}</h2>
          <a className="text-sm text-brand-neon" href={`/${params.locale}/noticias`}>
            {i18n.getFixedT(params.locale, 'common')('actions.viewAll')}
          </a>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {newsFeed.map((entry) => (
            <article key={entry.slug} className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
              <h3 className="text-lg font-semibold text-brand-neon">
                {typeof entry.title === 'string' ? entry.title : entry.title[params.locale]}
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                {typeof entry.summary === 'string' ? entry.summary : entry.summary[params.locale]}
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">{t('sections.featuredTools')}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {tools.map((tool) => (
            <div key={tool.website} className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/40 p-6">
              <div>
                <h3 className="text-lg font-semibold text-brand-neon">
                  {typeof tool.title === 'string' ? tool.title : tool.title[params.locale]}
                </h3>
                <p className="mt-2 text-sm text-slate-300">
                  {typeof tool.summary === 'string' ? tool.summary : tool.summary[params.locale]}
                </p>
              </div>
              <div className="mt-4 text-xs text-slate-400">
                <p>{tool.category} · {tool.pricing}</p>
                <a href={tool.website} target="_blank" rel="noreferrer" className="text-brand-neon">
                  {tool.website.replace('https://', '')}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">{t('sections.learningPaths')}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {tutorials.map((tutorial) => (
            <div key={tutorial.slug} className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
              <h3 className="text-lg font-semibold text-brand-neon">
                {typeof tutorial.title === 'string' ? tutorial.title : tutorial.title[params.locale]}
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                {typeof tutorial.summary === 'string' ? tutorial.summary : tutorial.summary[params.locale]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
