import { createTranslation } from '../../i18n';

export default async function LegalPage({ params }: { params: { locale: 'pt' | 'en' } }) {
  const { t } = await createTranslation(params.locale, 'legal');

  const sections = [
    {
      title: params.locale === 'pt' ? 'Proteção de dados' : 'Data protection',
      content:
        params.locale === 'pt'
          ? 'Utilizamos criptografia, segmentação de dados e retenção mínima alinhada a LGPD e GDPR.'
          : 'We use encryption, data segmentation and minimal retention aligned with GDPR and LGPD.'
    },
    {
      title: params.locale === 'pt' ? 'Logs e auditoria' : 'Logs and auditing',
      content:
        params.locale === 'pt'
          ? 'Logs imutáveis são armazenados por 180 dias com acesso controlado e alertas para atividades suspeitas.'
          : 'Immutable logs are stored for 180 days with controlled access and alerts for suspicious activity.'
    },
    {
      title: params.locale === 'pt' ? 'Termos de uso' : 'Terms of use',
      content:
        params.locale === 'pt'
          ? 'Usuários concordam em utilizar o portal para fins legítimos e manter confidencialidade das credenciais.'
          : 'Users agree to use the portal for legitimate purposes and keep credentials confidential.'
    }
  ];

  return (
    <section className="space-y-10">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold text-brand-neon">{t('title')}</h1>
        <p className="text-lg text-slate-300">{t('description')}</p>
      </header>
      <div className="space-y-6">
        {sections.map((section) => (
          <article key={section.title} className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="text-xl font-semibold text-brand-neon">{section.title}</h2>
            <p className="text-sm text-slate-300">{section.content}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
