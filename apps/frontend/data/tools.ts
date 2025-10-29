import type { ToolEntry } from '../types/content';

export const tools: ToolEntry[] = [
  {
    title: {
      pt: 'OWASP ZAP',
      en: 'OWASP ZAP'
    },
    summary: {
      pt: 'Scanner DAST open source com APIs para automação em pipelines CI/CD.',
      en: 'Open source DAST scanner with APIs for CI/CD automation.'
    },
    type: 'tool',
    vendor: 'OWASP',
    category: 'DAST',
    pricing: 'open-source',
    website: 'https://www.zaproxy.org',
    tags: ['dast', 'owasp', 'automation'],
    integrations: ['GitHub Actions', 'Azure DevOps'],
    keywords: ['ZAP', 'DAST', 'scanner']
  },
  {
    title: {
      pt: 'Semgrep',
      en: 'Semgrep'
    },
    summary: {
      pt: 'Análise estática rápida com regras customizáveis e marketplace comunitário.',
      en: 'Fast static analysis with customizable rules and a community marketplace.'
    },
    type: 'tool',
    vendor: 'r2c',
    category: 'SAST',
    pricing: 'freemium',
    website: 'https://semgrep.dev',
    tags: ['sast', 'rules'],
    integrations: ['GitLab', 'GitHub'],
    keywords: ['SAST', 'Semgrep']
  }
];
