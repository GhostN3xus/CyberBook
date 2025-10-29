import { createTranslation } from '../../i18n';
import { Button } from '../../../components/ui/button';

export default async function AuthPage({ params }: { params: { locale: 'pt' | 'en' } }) {
  const { t } = await createTranslation(params.locale, 'auth');

  return (
    <section className="grid gap-8 md:grid-cols-2">
      <div className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <h1 className="text-3xl font-semibold text-brand-neon">{t('title')}</h1>
        <form className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-slate-300" htmlFor="email">
              {t('email')}
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-md border border-slate-700 bg-slate-950/60 p-3 text-sm text-slate-200 focus:border-brand-neon focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-slate-300" htmlFor="password">
              {t('password')}
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-md border border-slate-700 bg-slate-950/60 p-3 text-sm text-slate-200 focus:border-brand-neon focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-slate-300" htmlFor="mfa">
              {t('mfa')}
            </label>
            <input
              id="mfa"
              type="text"
              className="w-full rounded-md border border-slate-700 bg-slate-950/60 p-3 text-sm text-slate-200 focus:border-brand-neon focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-700 bg-slate-900" />
              {t('remember')}
            </label>
            <a href="#" className="text-brand-neon">
              {t('reset')}
            </a>
          </div>
          <Button className="w-full" type="submit">
            {t('login')}
          </Button>
        </form>
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-slate-400">{t('providers')}</p>
          <div className="flex flex-wrap gap-3 text-sm text-slate-200">
            <Button variant="outline" className="flex-1">
              GitHub
            </Button>
            <Button variant="outline" className="flex-1">
              Azure AD
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-2xl font-semibold text-brand-neon">{t('register')}</h2>
        <p className="text-sm text-slate-300">
          {params.locale === 'pt'
            ? 'Solicite acesso com aprovação da equipe de segurança. MFA é obrigatório para administradores.'
            : 'Request access with security team approval. MFA is mandatory for administrators.'}
        </p>
        <ul className="list-disc space-y-2 pl-6 text-sm text-slate-300">
          <li>{params.locale === 'pt' ? 'Fluxo de convite e verificação de domínio corporativo.' : 'Invite flow with corporate domain verification.'}</li>
          <li>{params.locale === 'pt' ? 'Suporte a OAuth2 (GitHub, Azure AD) e MFA via TOTP.' : 'OAuth2 (GitHub, Azure AD) and MFA via TOTP.'}</li>
          <li>{params.locale === 'pt' ? 'Tokens JWT assinados e refresh seguro com rotação.' : 'Signed JWT tokens and secure refresh with rotation.'}</li>
        </ul>
      </div>
    </section>
  );
}
