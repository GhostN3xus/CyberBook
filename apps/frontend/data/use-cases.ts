import type { SearchableContent } from '../types/content';

export interface UseCase extends SearchableContent {
  sector: string;
  maturity: 'initial' | 'intermediate' | 'advanced';
  outcomes: string[];
}

export const useCases: UseCase[] = [
  {
    type: 'use-case',
    slug: 'casos-de-uso/financas-zero-trust',
    title: {
      pt: 'Instituição Financeira: Jornada Zero Trust',
      en: 'Financial Institution: Zero Trust Journey'
    },
    summary: {
      pt: 'Sequência de controles para bancos digitais reduzirem superfícies de ataque e fraudadores internos.',
      en: 'Control sequence helping digital banks reduce attack surface and insider fraud exposure.'
    },
    sector: 'Finance',
    maturity: 'advanced',
    outcomes: [
      'MFA obrigatório para acesso administrativo',
      'Mapeamento contínuo de ativos críticos',
      'Telemetria centralizada para análise comportamental'
    ],
    tags: ['zero-trust', 'finance', 'governanca'],
    keywords: [
      { pt: 'segmentação de rede', en: 'network segmentation' },
      { pt: 'fraude interna', en: 'insider fraud' }
    ],
    metadata: {
      owner: 'Blue Bank',
      timeline: '9 meses'
    }
  },
  {
    type: 'use-case',
    slug: 'casos-de-uso/saude-devsecops',
    title: {
      pt: 'Saúde: DevSecOps com foco em compliance',
      en: 'Healthcare: Compliance-driven DevSecOps'
    },
    summary: {
      pt: 'Fluxo integrado de análise SAST/DAST e monitoramento contínuo para aplicações regulamentadas (LGPD + HIPAA).',
      en: 'Integrated SAST/DAST and runtime monitoring for regulated healthcare workloads (LGPD + HIPAA).'
    },
    sector: 'Healthcare',
    maturity: 'intermediate',
    outcomes: [
      'Portais com autenticação resistente a phishing',
      'Pipeline automatizado com gates de segurança',
      'Relatórios de auditoria exportáveis sob demanda'
    ],
    tags: ['devsecops', 'healthcare', 'compliance'],
    keywords: [
      { pt: 'hipaa', en: 'hipaa' },
      { pt: 'pipeline', en: 'pipeline' }
    ],
    metadata: {
      owner: 'Vida Segura',
      timeline: '6 meses'
    }
  },
  {
    type: 'use-case',
    slug: 'casos-de-uso/retail-fraude',
    title: {
      pt: 'Varejo: Resposta rápida a fraudes em e-commerce',
      en: 'Retail: Rapid e-commerce fraud response'
    },
    summary: {
      pt: 'Arquitetura de detecção near-real-time combinando IA e regras para mitigar chargeback e account takeover.',
      en: 'Near-real-time detection architecture mixing AI and rules to mitigate chargebacks and account takeover.'
    },
    sector: 'Retail',
    maturity: 'initial',
    outcomes: [
      'Playbooks de investigação com RTO < 15 minutos',
      'Integração com antifraude e SIEM corporativo',
      'Treinamentos trimestrais de engenharia social'
    ],
    tags: ['fraud', 'retail', 'monitoramento'],
    keywords: [
      { pt: 'fraude em e-commerce', en: 'e-commerce fraud' },
      { pt: 'chargeback', en: 'chargeback' }
    ],
    metadata: {
      owner: 'Loja Protegida',
      timeline: '4 meses'
    }
  }
];
