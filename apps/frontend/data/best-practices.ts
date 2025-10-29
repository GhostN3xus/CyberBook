import type { SearchableContent } from '../types/content';

export const bestPractices: SearchableContent[] = [
  {
    title: {
      pt: 'Fluxo de revisão segura',
      en: 'Secure review workflow'
    },
    summary: {
      pt: 'Checklist de revisão de código com foco em autenticação, autorização e logging.',
      en: 'Code review checklist focused on authentication, authorization and logging.'
    },
    type: 'tutorial',
    slug: 'secure-review-workflow',
    keywords: ['code review', 'rbac']
  },
  {
    title: {
      pt: 'Política de segredos e cofres',
      en: 'Secrets policy and vaults'
    },
    summary: {
      pt: 'Diretrizes para rotação, segregação e auditoria de segredos.',
      en: 'Guidance on rotation, segregation and auditing secrets.'
    },
    type: 'tutorial',
    slug: 'secrets-policy',
    keywords: ['secrets', 'vault', 'policy']
  }
];
