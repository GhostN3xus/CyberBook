import { createTranslation } from '../../i18n';

export default async function AboutPage({ params }: { params: { locale: 'pt' | 'en' } }) {
  const { t } = await createTranslation(params.locale, 'about');
  const values = t('values', { returnObjects: true }) as { title: string; description: string }[];

  return (
    <section className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-brand-neon">{t('title')}</h1>
        <p className="text-lg text-slate-200">{t('mission')}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {values.map((value) => (
          <div key={value.title} className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <h3 className="text-xl font-semibold text-brand-neon">{value.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{value.description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-8">
        <h2 className="text-2xl font-semibold text-brand-neon">{t('team.title')}</h2>
        <p className="mt-4 text-sm text-slate-300">{t('team.description')}</p>
      </div>
    </section>
  );
}
