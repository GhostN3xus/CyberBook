import type { SearchableContent } from '../types/content';

export const tutorials: SearchableContent[] = [
  {
    title: {
      pt: 'Pipeline DevSecOps com GitHub Actions',
      en: 'DevSecOps pipeline with GitHub Actions'
    },
    summary: {
      pt: 'Integre SAST, DAST e análise de dependências em um fluxo automatizado.',
      en: 'Integrate SAST, DAST and dependency scanning into an automated flow.'
    },
    type: 'tutorial',
    slug: 'devsecops-github-actions',
    keywords: ['ci', 'cd', 'github', 'pipeline']
  },
  {
    title: {
      pt: 'Modelagem de ameaças com STRIDE',
      en: 'Threat modeling with STRIDE'
    },
    summary: {
      pt: 'Passo a passo para identificar riscos, contramedidas e backlog de segurança.',
      en: 'Step-by-step to identify risks, countermeasures and security backlog.'
    },
    type: 'tutorial',
    slug: 'stride-threat-modeling',
    keywords: ['threat modeling', 'stride']
  }
];
