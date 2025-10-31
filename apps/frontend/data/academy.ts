import type { SearchableContent } from '../types/content';

export interface AcademyModule extends SearchableContent {
  durationHours: number;
  difficulty: 'foundation' | 'professional' | 'expert';
  lessons: {
    id: string;
    title: {
      pt: string;
      en: string;
    };
  }[];
}

export const academyModules: AcademyModule[] = [
  {
    type: 'academy-module',
    slug: 'academy/fundamentos-appsec',
    title: {
      pt: 'Fundamentos de AppSec',
      en: 'AppSec Foundations'
    },
    summary: {
      pt: 'Entenda pilares essenciais de segurança de aplicações, modelagem de ameaças e requisitos seguros.',
      en: 'Understand key pillars of application security, threat modeling and secure requirements.'
    },
    durationHours: 12,
    difficulty: 'foundation',
    lessons: [
      {
        id: 'threat-modeling',
        title: {
          pt: 'Modelagem de ameaças prática',
          en: 'Hands-on threat modeling'
        }
      },
      {
        id: 'secure-requirements',
        title: {
          pt: 'Requisitos de segurança desde o discovery',
          en: 'Security requirements during discovery'
        }
      }
    ],
    tags: ['owasp', 'threat-modeling', 'requirements'],
    keywords: [
      { pt: 'fundamentos', en: 'foundations' },
      { pt: 'modelagem de ameaças', en: 'threat modeling' }
    ]
  },
  {
    type: 'academy-module',
    slug: 'academy/arquitetura-segura',
    title: {
      pt: 'Arquitetura Segura em Nuvem',
      en: 'Secure Cloud Architecture'
    },
    summary: {
      pt: 'Estratégias de segmentação, proteções para APIs e governança multi-conta na nuvem.',
      en: 'Segmentation strategies, API protections and multi-account governance in the cloud.'
    },
    durationHours: 16,
    difficulty: 'professional',
    lessons: [
      {
        id: 'api-hardening',
        title: {
          pt: 'Endurecimento de APIs e proteção contra abuso',
          en: 'API hardening and abuse protection'
        }
      },
      {
        id: 'cloud-landing-zone',
        title: {
          pt: 'Landing zones seguras multi-conta',
          en: 'Secure multi-account landing zones'
        }
      }
    ],
    tags: ['cloud', 'architecture', 'api-security'],
    keywords: [
      { pt: 'nuvem', en: 'cloud' },
      { pt: 'governança', en: 'governance' }
    ]
  },
  {
    type: 'academy-module',
    slug: 'academy/resposta-incidentes',
    title: {
      pt: 'Resposta a Incidentes e Purple Team',
      en: 'Incident Response & Purple Team'
    },
    summary: {
      pt: 'Laboratórios guiados para montar playbooks de resposta e simular ataques avançados.',
      en: 'Guided labs to build response playbooks and simulate advanced attacks.'
    },
    durationHours: 18,
    difficulty: 'expert',
    lessons: [
      {
        id: 'playbooks',
        title: {
          pt: 'Playbooks prescritivos por severidade',
          en: 'Prescriptive playbooks by severity'
        }
      },
      {
        id: 'purple-team-labs',
        title: {
          pt: 'Laboratórios de purple team',
          en: 'Purple team labs'
        }
      }
    ],
    tags: ['incident-response', 'purple-team', 'operations'],
    keywords: [
      { pt: 'resposta a incidentes', en: 'incident response' },
      { pt: 'purple team', en: 'purple team' }
    ]
  }
];
