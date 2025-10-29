import { createTranslation } from '../../i18n';

const cards = [
  { key: 'content', value: '128', trend: '+12%' },
  { key: 'pending', value: '5', trend: '2 SLA' },
  { key: 'alerts', value: '3', trend: 'High' },
  { key: 'backups', value: '12h', trend: 'OK' }
];

export default async function AdminDashboardPage({ params }: { params: { locale: 'pt' | 'en' } }) {
  const { t } = await createTranslation(params.locale, 'admin');

  return (
    <section className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-brand-neon">{t('dashboard.title')}</h1>
        <p className="text-lg text-slate-300">{t('dashboard.subtitle')}</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.key} className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <p className="text-sm uppercase tracking-wide text-slate-400">{t(`dashboard.cards.${card.key}`)}</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-brand-neon">{card.value}</span>
              <span className="text-xs text-slate-400">{card.trend}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-xl font-semibold text-brand-neon">Audit log</h2>
        <ul className="space-y-2 text-sm text-slate-300">
          <li>2024-03-18 · admin@example.com · Created vulnerability CWE-352</li>
          <li>2024-03-18 · editor@example.com · Updated article OWASP API1</li>
          <li>2024-03-17 · admin@example.com · Exported weekly backup</li>
        </ul>
      </div>
    </section>
  );
}
