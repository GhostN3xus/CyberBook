import type { SearchableContent } from '../types/content';

export const cweCatalog: (SearchableContent & {
  cweId: string;
  owaspMapping: string[];
  mitigation: {
    pt: string;
    en: string;
  };
})[] = [
  {
    title: {
      pt: 'CWE-79 - Cross-Site Scripting',
      en: 'CWE-79 - Cross-Site Scripting'
    },
    summary: {
      pt: 'Execução de scripts maliciosos por falta de codificação ou validação.',
      en: 'Malicious script execution due to missing encoding or validation.'
    },
    type: 'guide',
    cweId: 'CWE-79',
    owaspMapping: ['A03:2021'],
    mitigation: {
      pt: 'Utilize encoding contextual, CSP, validação no servidor e bibliotecas seguras.',
      en: 'Use contextual encoding, CSP, server-side validation and safe libraries.'
    },
    keywords: ['xss', 'encoding']
  },
  {
    title: {
      pt: 'CWE-352 - Cross-Site Request Forgery',
      en: 'CWE-352 - Cross-Site Request Forgery'
    },
    summary: {
      pt: 'Ataques que exploram a sessão do usuário para executar ações sem consentimento.',
      en: 'Attacks exploiting user sessions to perform unwanted actions.'
    },
    type: 'guide',
    cweId: 'CWE-352',
    owaspMapping: ['A05:2021'],
    mitigation: {
      pt: 'Implemente tokens anti-CSRF, verificação de origem e autenticação reforçada.',
      en: 'Implement anti-CSRF tokens, origin checks and strengthened authentication.'
    },
    keywords: ['csrf', 'session']
  }
];
