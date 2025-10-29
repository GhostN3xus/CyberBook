import { createTranslation } from '../../../i18n';
import { owaspTop10 } from '../../../../data/owasp-top10';
import { NoteEditor } from '../../../../components/notes/note-editor';
export default async function OwaspTop10Page({ params }: { params: { locale: 'pt' | 'en' } }) {
  const { t } = await createTranslation(params.locale, 'checklists');

  return (
    <section className="space-y-12">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold text-brand-neon">{t('owaspTop10.title')}</h1>
        <p className="text-lg text-slate-300">{t('owaspTop10.description')}</p>
      </header>

      <div className="space-y-6">
        {owaspTop10.map((item) => {
          const title = typeof item.title === 'string' ? item.title : item.title[params.locale];
          const summary = typeof item.summary === 'string' ? item.summary : item.summary[params.locale];
          return (
            <article key={title} id={title.toLowerCase().replace(/\s+/g, '-')} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg shadow-brand-neon/5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold text-brand-neon">{title}</h2>
                  <p className="text-sm text-slate-300">{summary}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                    <span className="rounded-full border border-brand-neon/40 px-3 py-1">CWE: {item.cwe}</span>
                    <span className="rounded-full border border-brand-neon/40 px-3 py-1">OWASP: {item.owasp.join(', ')}</span>
                    <span className="rounded-full border border-brand-neon/40 px-3 py-1">Risk: {item.risk}</span>
                    <span className="rounded-full border border-brand-neon/40 px-3 py-1">Complexity: {item.complexity}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold text-red-400">{params.locale === 'pt' ? 'Exemplo inseguro' : 'Insecure example'}</h3>
                  <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-950/70 p-4 text-xs text-red-300">{item.insecureExample[params.locale]}</pre>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-emerald-400">{params.locale === 'pt' ? 'Exemplo seguro' : 'Secure example'}</h3>
                  <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-950/70 p-4 text-xs text-emerald-300">{item.secureExample[params.locale]}</pre>
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
                <NoteEditor noteId={`owasp-${item.cwe}`} title={title} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
