import { createInstance, i18n as I18NextInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { defaultNS, fallbackLng, namespaces, AppLocale } from './settings';
import i18nextConfig from '../../next-i18next.config';

export async function createTranslation(lng: AppLocale, ns: string | string[]) {
  const i18nInstance = createInstance({
    ...i18nextConfig,
    lng,
    ns,
    fallbackLng,
    defaultNS,
    preload: [lng]
  }) as I18NextInstance;

  const ensureNamespaces = Array.isArray(ns) ? ns : [ns];

  ensureNamespaces.forEach((namespace) => {
    if (!namespaces.includes(namespace as (typeof namespaces)[number])) {
      throw new Error(`Namespace "${namespace}" não configurado.`);
    }
  });

  i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language: string, namespace: string) => import(`../../public/locales/${language}/${namespace}.json`)));

  if (!i18nInstance.isInitialized) {
    await i18nInstance.init();
  }

  return {
    t: i18nInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns),
    i18n: i18nInstance
  };
}

export const i18nNamespaces = namespaces;
