import type { SearchableContent } from '../types/content';

export const newsFeed: SearchableContent[] = [
  {
    title: {
      pt: 'Relatório OWASP ASVS 2024',
      en: 'OWASP ASVS 2024 Report'
    },
    summary: {
      pt: 'Atualizações do padrão ASVS com novos requisitos para arquiteturas serverless.',
      en: 'ASVS updates introducing new requirements for serverless architectures.'
    },
    type: 'news',
    slug: 'owasp-asvs-2024',
    metadata: {
      url: 'https://owasp.org/www-project-application-security-verification-standard/'
    },
    keywords: ['asvs', 'owasp', 'serverless']
  },
  {
    title: {
      pt: 'CVE-2024-12345 em bibliotecas JWT',
      en: 'CVE-2024-12345 in JWT libraries'
    },
    summary: {
      pt: 'Tokens podem ser forjados devido a verificação inadequada de algoritmo em libs populares.',
      en: 'Tokens can be forged due to insufficient algorithm verification in popular libraries.'
    },
    type: 'news',
    slug: 'cve-2024-12345',
    keywords: ['jwt', 'cve', 'vulnerability']
  }
];
