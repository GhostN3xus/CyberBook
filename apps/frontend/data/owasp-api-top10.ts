import type { VulnerabilityGuide } from '../types/content';

export const owaspApiTop10: VulnerabilityGuide[] = [
  {
    title: {
      pt: 'API1:2023 - Quebra de Controle de Objeto Nível API',
      en: 'API1:2023 - Broken Object Level Authorization'
    },
    summary: {
      pt: 'APIs expostas sem validação de proprietário permitem acesso e manipulação de dados indevidos.',
      en: 'APIs without ownership checks allow unauthorized data access and manipulation.'
    },
    type: 'checklist',
    cwe: 'CWE-639',
    owasp: ['API1:2023'],
    risk: 'critical',
    complexity: 'medium',
    insecureExample: {
      pt: 'GET /api/projects/123 retorna dados sem validar se o usuário faz parte do projeto.',
      en: 'GET /api/projects/123 returns data without validating whether the user belongs to the project.'
    },
    secureExample: {
      pt: 'Validar ownership no backend aplicando políticas de autorização por recurso.',
      en: 'Check ownership server-side by enforcing resource-level authorization policies.'
    },
    remediation: {
      pt: 'Implemente filtros de escopo, políticas ABAC e logs de acesso para detectar abuso.',
      en: 'Implement scope filters, ABAC policies and access logging to detect abuse.'
    },
    references: [
      {
        label: {
          pt: 'OWASP API1',
          en: 'OWASP API1'
        },
        url: 'https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/'
      }
    ]
  }
];
