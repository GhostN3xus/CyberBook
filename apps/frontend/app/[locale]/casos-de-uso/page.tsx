import { createTranslation } from '../../i18n';
import { useCases } from '../../../data/use-cases';
import { UseCaseExplorer } from '../../../components/use-cases/use-case-explorer';

export default async function UseCasesPage({ params }: { params: { locale: 'pt' | 'en' } }) {
  const { t } = await createTranslation(params.locale, 'use-cases');

  return (
    <section className="space-y-10">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold text-brand-neon">{t('title')}</h1>
        <p className="max-w-3xl text-lg text-slate-300">{t('intro')}</p>
      </header>

      <UseCaseExplorer
        cases={useCases}
        locale={params.locale}
        labels={{
          sector: t('labels.sector'),
          maturity: t('labels.maturity'),
          outcomes: t('labels.outcomes'),
          outcomesEmpty: t('labels.outcomesEmpty'),
          metadata: t('labels.metadata')
        }}
        filterLabels={{
          all: t('filters.all'),
          sector: t('filters.sector'),
          maturity: t('filters.maturity')
        }}
        maturityLabels={{
          initial: t('maturity.initial'),
          intermediate: t('maturity.intermediate'),
          advanced: t('maturity.advanced')
        }}
        emptyMessage={t('empty')}
      />
    </section>
  );
}
