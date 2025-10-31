import { createTranslation } from '../../i18n';

type StatusKey = 'done' | 'in-progress' | 'planned';

type RoadmapSection = {
  title: string;
  description: string;
  items: { label: string; status: StatusKey }[];
};

type PlannedPage = {
  name: string;
  status: StatusKey;
  description: string;
};

const statusStyles: Record<StatusKey, string> = {
  done: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  'in-progress': 'border-amber-500/40 bg-amber-500/10 text-amber-200',
  planned: 'border-slate-600/40 bg-slate-700/10 text-slate-300'
};

export default async function RoadmapPage({ params }: { params: { locale: 'pt' | 'en' } }) {
  const { t } = await createTranslation(params.locale, 'roadmap');
  const sections = t('sections', { returnObjects: true }) as RoadmapSection[];
  const statusLabels = t('status', { returnObjects: true }) as Record<StatusKey, string>;
  const plannedPages = t('pages.items', { returnObjects: true }) as PlannedPage[];

  return (
    <section className="space-y-12">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold text-brand-neon">{t('title')}</h1>
        <p className="max-w-3xl text-lg text-slate-200">{t('intro')}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {sections.map((section) => (
          <article key={section.title} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-brand-neon">{section.title}</h2>
              <p className="text-sm text-slate-300">{section.description}</p>
            </div>

            <ul className="space-y-3">
              {section.items.map((item) => (
                <li key={item.label} className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <span className="block text-sm font-medium text-slate-100">{item.label}</span>
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                      statusStyles[item.status]
                    }`}
                  >
                    {statusLabels[item.status]}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <section className="space-y-4 rounded-2xl border border-brand-neon/30 bg-brand-dark/60 p-6">
        <header>
          <h2 className="text-2xl font-semibold text-brand-neon">{t('pages.title')}</h2>
          <p className="text-sm text-slate-300">{t('pages.description')}</p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {plannedPages.map((page) => (
            <div key={page.name} className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-100">{page.name}</h3>
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                    statusStyles[page.status]
                  }`}
                >
                  {statusLabels[page.status]}
                </span>
              </div>
              <p className="text-sm text-slate-300">{page.description}</p>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
