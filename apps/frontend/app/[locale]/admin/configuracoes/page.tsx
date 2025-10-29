import { createTranslation } from '../../../i18n';

export default async function AdminSettingsPage({ params }: { params: { locale: 'pt' | 'en' } }) {
  const { t } = await createTranslation(params.locale, 'admin');

  const sections = [
    { key: 'users', description: params.locale === 'pt' ? 'Gerencie convites, RBAC e bloqueio temporário.' : 'Manage invitations, RBAC and temporary lockout.' },
    { key: 'permissions', description: params.locale === 'pt' ? 'Defina escopos de edição, aprovação e publicação.' : 'Define editing, approval and publishing scopes.' },
    { key: 'logs', description: params.locale === 'pt' ? 'Configure retenção de logs, exportações e alertas SIEM.' : 'Configure log retention, exports and SIEM alerts.' },
    { key: 'backups', description: params.locale === 'pt' ? 'Agende backups automáticos e exportações criptografadas.' : 'Schedule automated backups and encrypted exports.' }
  ];

  return (
    <section className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-brand-neon">{t('settings.title')}</h1>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {sections.map((section) => (
          <article key={section.key} className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="text-xl font-semibold text-brand-neon">{t(`settings.${section.key}`)}</h2>
            <p className="text-sm text-slate-300">{section.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
