import type { VulnerabilityGuide } from '../types/content';

export const owaspTop10: VulnerabilityGuide[] = [
  {
    title: {
      pt: 'A01:2021 - Quebra de Controle de Acesso',
      en: 'A01:2021 - Broken Access Control'
    },
    summary: {
      pt: 'Falhas em autorização permitem acesso indevido a recursos sensíveis.',
      en: 'Authorization weaknesses allow attackers to access sensitive resources.'
    },
    type: 'checklist',
    cwe: 'CWE-284',
    owasp: ['A01:2021'],
    risk: 'critical',
    complexity: 'medium',
    insecureExample: {
      pt: "if (user.role === 'admin') { /* acesso */ } // usuários podem forjar o papel",
      en: "if (user.role === 'admin') { /* access */ } // users can forge the role"
    },
    secureExample: {
      pt: 'Aplicar RBAC no backend validando permissões por escopo e recurso.',
      en: 'Enforce server-side RBAC validating permissions per scope and resource.'
    },
    remediation: {
      pt: 'Padronize verificações de autorização, use políticas testáveis e minimize privilégios.',
      en: 'Centralize authorization checks, use testable policies and enforce least privilege.'
    },
    references: [
      {
        label: {
          pt: 'OWASP - Quebra de Controle de Acesso',
          en: 'OWASP - Broken Access Control'
        },
        url: 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/'
      },
      {
        label: {
          pt: 'NIST SP 800-63B',
          en: 'NIST SP 800-63B'
        },
        url: 'https://pages.nist.gov/800-63-3/sp800-63b.html'
      }
    ]
  },
  {
    title: {
      pt: 'A02:2021 - Criptografia Quebrada',
      en: 'A02:2021 - Cryptographic Failures'
    },
    summary: {
      pt: 'Implementações fracas expõem dados sensíveis em trânsito ou repouso.',
      en: 'Weak crypto exposes sensitive data at rest or in transit.'
    },
    type: 'checklist',
    cwe: 'CWE-327',
    owasp: ['A02:2021'],
    risk: 'high',
    complexity: 'medium',
    insecureExample: {
      pt: "const hash = crypto.createHash('md5').update(password).digest('hex');",
      en: "const hash = crypto.createHash('md5').update(password).digest('hex');"
    },
    secureExample: {
      pt: "const hash = await bcrypt.hash(password, 12);",
      en: "const hash = await bcrypt.hash(password, 12);"
    },
    remediation: {
      pt: 'Use TLS 1.3, algoritmos modernos, rotação de chaves e cofres de segredos.',
      en: 'Adopt TLS 1.3, modern algorithms, key rotation and secret vaults.'
    },
    references: [
      {
        label: {
          pt: 'OWASP Criptografia',
          en: 'OWASP Cryptographic Failures'
        },
        url: 'https://owasp.org/Top10/A02_2021-Cryptographic_Failures/'
      },
      {
        label: {
          pt: 'MDN - TLS',
          en: 'MDN - TLS'
        },
        url: 'https://developer.mozilla.org/docs/Web/Security/Transport_Layer_Security'
      }
    ]
  }
];
