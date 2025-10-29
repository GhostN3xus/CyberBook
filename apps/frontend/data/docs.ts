import type { SearchableContent } from '../types/content';

export const officialDocs: SearchableContent[] = [
  {
    title: {
      pt: 'Node.js Security Best Practices',
      en: 'Node.js Security Best Practices'
    },
    summary: {
      pt: 'Recomendações oficiais para proteger aplicações Node.js contra exposições e ataques.',
      en: 'Official recommendations to protect Node.js applications from exposures and attacks.'
    },
    type: 'doc',
    slug: 'nodejs-security',
    metadata: {
      url: 'https://nodejs.org/en/learn/getting-started/security-best-practices'
    },
    keywords: ['node.js', 'security']
  },
  {
    title: {
      pt: 'OWASP.org',
      en: 'OWASP.org'
    },
    summary: {
      pt: 'Organização que mantém padrões, projetos e treinamentos globais de AppSec.',
      en: 'Organization maintaining global AppSec standards, projects and trainings.'
    },
    type: 'doc',
    slug: 'owasp',
    metadata: {
      url: 'https://owasp.org'
    },
    keywords: ['owasp', 'standards']
  },
  {
    title: {
      pt: 'MDN Web Security',
      en: 'MDN Web Security'
    },
    summary: {
      pt: 'Coleção de artigos da Mozilla com recomendações de segurança web modernas.',
      en: 'Mozilla articles featuring modern web security recommendations.'
    },
    type: 'doc',
    slug: 'mdn-web-security',
    metadata: {
      url: 'https://developer.mozilla.org/docs/Web/Security'
    },
    keywords: ['mdn', 'web']
  }
];
