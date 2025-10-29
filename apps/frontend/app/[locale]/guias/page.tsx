import { createTranslation } from '../../i18n';
import { languageGuides } from '../../../data/language-guides';
import { NoteEditor } from '../../../components/notes/note-editor';

export default async function LanguageGuidesPage({ params }: { params: { locale: 'pt' | 'en' } }) {
  const { t } = await createTranslation(params.locale, 'guides');
  const languages = Object.entries(languageGuides);

  return (
    <section className="space-y-12">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold text-brand-neon">{t('title')}</h1>
        <p className="text-lg text-slate-300">{t('intro')}</p>
      </header>

      <div className="space-y-10">
        {languages.map(([key, guides]) => (
          <div key={key} id={key} className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="text-2xl font-semibold text-brand-neon">{t(`languages.${key}` as any)}</h2>
            <div className="grid gap-6">
              {guides.map((guide) => (
                <article key={guide.cwe} className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/40 p-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-brand-neon">
                      {typeof guide.title === 'string' ? guide.title : guide.title[params.locale]}
                    </h3>
                    <p className="text-sm text-slate-300">
                      {typeof guide.summary === 'string' ? guide.summary : guide.summary[params.locale]}
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="text-xs font-semibold text-red-400">{params.locale === 'pt' ? 'Inseguro' : 'Insecure'}</h4>
                      <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-950/70 p-4 text-xs text-red-300">{guide.insecureExample[params.locale]}</pre>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-emerald-400">{params.locale === 'pt' ? 'Seguro' : 'Secure'}</h4>
                      <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-950/70 p-4 text-xs text-emerald-300">{guide.secureExample[params.locale]}</pre>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300">{guide.remediation[params.locale]}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-brand-neon">
                    {guide.references.map((reference) => (
                      <a key={reference.url} href={reference.url} target="_blank" rel="noreferrer" className="underline decoration-dotted">
                        {reference.label[params.locale]}
                      </a>
                    ))}
                  </div>
                  <NoteEditor noteId={`${key}-${guide.cwe}`} title={typeof guide.title === 'string' ? guide.title : guide.title[params.locale]} />
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
