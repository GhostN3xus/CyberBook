import { createTranslation } from '../../../i18n';
import { owaspApiTop10 } from '../../../../data/owasp-api-top10';
import { NoteEditor } from '../../../../components/notes/note-editor';

export default async function OwaspApiPage({ params }: { params: { locale: 'pt' | 'en' } }) {
  const { t } = await createTranslation(params.locale, 'checklists');

  return (
    <section className="space-y-12">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold text-brand-neon">{t('owaspApi.title')}</h1>
        <p className="text-lg text-slate-300">{t('owaspApi.description')}</p>
      </header>
      <div className="space-y-6">
        {owaspApiTop10.map((item) => {
          const title = typeof item.title === 'string' ? item.title : item.title[params.locale];
          const summary = typeof item.summary === 'string' ? item.summary : item.summary[params.locale];

          return (
            <article key={title} id={title.toLowerCase().replace(/\s+/g, '-')} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold text-brand-neon">{title}</h2>
                <p className="text-sm text-slate-300">{summary}</p>
              </div>
              <div className="mt-4 grid gap-4 text-sm text-slate-300 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-red-400">{params.locale === 'pt' ? 'Exemplo inseguro' : 'Insecure example'}</h3>
                  <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-950/60 p-4 text-xs text-red-300">{item.insecureExample[params.locale]}</pre>
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-400">{params.locale === 'pt' ? 'Exemplo seguro' : 'Secure example'}</h3>
                  <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-950/60 p-4 text-xs text-emerald-300">{item.secureExample[params.locale]}</pre>
                </div>
              </div>
              <div className="mt-6 space-y-2 text-sm text-slate-300">
                <h3 className="font-semibold text-brand-neon">{params.locale === 'pt' ? 'Mitigação' : 'Mitigation'}</h3>
                <p>{item.remediation[params.locale]}</p>
                <div className="flex flex-wrap gap-3 text-xs text-brand-neon">
                  {item.references.map((reference) => (
                    <a key={reference.url} href={reference.url} target="_blank" rel="noreferrer" className="underline decoration-dotted">
                      {reference.label[params.locale]}
                    </a>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <NoteEditor noteId={`owasp-api-${item.cwe}`} title={title} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
