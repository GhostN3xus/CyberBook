import { createTranslation } from '../../i18n';
import { Button } from '../../../components/ui/button';

export default async function ContactPage({ params }: { params: { locale: 'pt' | 'en' } }) {
  const { t } = await createTranslation(params.locale, 'contact');

  return (
    <section className="space-y-10">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold text-brand-neon">{t('title')}</h1>
        <p className="text-lg text-slate-300">{t('description')}</p>
      </header>
      <form className="grid gap-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm text-slate-300" htmlFor="name">
            {t('fields.name')}
          </label>
          <input
            id="name"
            className="w-full rounded-md border border-slate-700 bg-slate-950/60 p-3 text-sm text-slate-200 focus:border-brand-neon focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-slate-300" htmlFor="email">
            {t('fields.email')}
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-md border border-slate-700 bg-slate-950/60 p-3 text-sm text-slate-200 focus:border-brand-neon focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-slate-300" htmlFor="company">
            {t('fields.company')}
          </label>
          <input
            id="company"
            className="w-full rounded-md border border-slate-700 bg-slate-950/60 p-3 text-sm text-slate-200 focus:border-brand-neon focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-slate-300" htmlFor="subject">
            {t('fields.subject')}
          </label>
          <input
            id="subject"
            className="w-full rounded-md border border-slate-700 bg-slate-950/60 p-3 text-sm text-slate-200 focus:border-brand-neon focus:outline-none"
          />
        </div>
        <div className="md:col-span-2 space-y-1">
          <label className="text-sm text-slate-300" htmlFor="message">
            {t('fields.message')}
          </label>
          <textarea
            id="message"
            rows={5}
            className="w-full rounded-md border border-slate-700 bg-slate-950/60 p-3 text-sm text-slate-200 focus:border-brand-neon focus:outline-none"
          />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <Button type="submit">{params.locale === 'pt' ? 'Enviar' : 'Send'}</Button>
        </div>
      </form>
    </section>
  );
}
