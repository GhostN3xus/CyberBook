# Guia do Guerreiro AppSec

Este repositório contém a fundação completa para o portal bilíngue **Guia do Guerreiro AppSec**, incluindo frontend (Next.js 14), backend (NestJS) e integrações essenciais de segurança.

## Estrutura do Monorepo

```
apps/
  frontend/   # Interface Next.js + Tailwind + next-i18next
  backend/    # API NestJS + Prisma + RBAC + MFA ready
``` 

### Principais recursos implementados

- Internacionalização completa (Português / Inglês) com `next-i18next`.
- 16 páginas principais já estruturadas com conteúdo técnico exemplo.
- Roadmap público detalhando segurança, operações e novas experiências planejadas.
- Hub de **casos de uso** com filtros por setor e maturidade para orientar adoção.
- **CyberBook Academy** com módulos e aulas bilíngues, incluindo rotas detalhadas por trilha.
- Sistema de buscas e filtros em memória com React Query (cliente) e endpoints preparados no backend.
- Anotações locais persistidas via `localStorage` e sincronização planejada com o backend.
- Layout responsivo, tema escuro/claro automático e componentes acessíveis (Radix UI + ShadCN).
- Backend modular com autenticação JWT + MFA, RBAC, auditoria e seed inicial do Prisma.
- Observabilidade inicial com endpoint `/health` e limites de payload (1 MB) para proteger a API contra abuse.
- Dashboard `/status` consumindo o health check enriquecido (telemetria de memória, versão e ambiente).
- Prontuário para integrações futuras (APIs externas, CI/CD, Snyk, OWASP Dependency-Check).

## Pré-requisitos

- Node.js 18+
- pnpm 8+ (ou npm/yarn – ajustes de scripts podem ser necessários)
- Docker (opcional para PostgreSQL)

## Instalação

```bash
pnpm install
pnpm run build:all
pnpm run dev
```

### Executar somente o frontend
```bash
pnpm --filter frontend dev
```

### Executar somente o backend
```bash
pnpm --filter backend start:dev
```

## Variáveis de ambiente

Copie os arquivos `.env.example` em cada projeto e ajuste as credenciais:

- `apps/frontend/.env.local`
- `apps/backend/.env`
- `NEXT_PUBLIC_API_BASE_URL` (frontend) — URL base do backend para o painel `/status` (ex.: `http://localhost:3001`).

## Scripts úteis

| Script | Descrição |
| --- | --- |
| `pnpm run dev` | Inicia frontend e backend com `concurrently`. |
| `pnpm run lint` | Executa lint em todos os workspaces. |
| `pnpm run test` | Executa testes unitários (Jest no backend). |
| `pnpm run build:all` | Builda frontend e backend para produção. |
| `pnpm run prisma:generate` | Gera o cliente Prisma. |
| `pnpm run prisma:migrate` | Executa migrações. |
| `pnpm run prisma:seed` | Popula o banco com dados base. |

### Monitoramento e Diagnóstico

- `GET /health` — retorna status geral do backend, uptime, versão e checagem básica do banco de dados (resposta JSON).
- `/status` — página pública que consome o health check e exibe telemetria do backend em tempo real.

## Documentação complementar

- [docs/IMPROVEMENT_CHECKLIST.md](docs/IMPROVEMENT_CHECKLIST.md) — avaliação completa da plataforma, backlog priorizado e novas páginas planejadas.

## Deploy

Scripts de GitHub Actions e manifestos Azure podem ser adicionados posteriormente. A aplicação foi pensada para:

- Frontend: Next.js em Azure Static Web Apps ou Azure App Service
- Backend: NestJS em Azure App Service (Linux)
- Banco: Azure PostgreSQL ou CosmosDB
- CDN: Cloudflare (TLS 1.3)

## Próximos passos sugeridos

1. Conectar o backend ao banco PostgreSQL e rodar as migrações Prisma.
2. Implementar integração real com provedores OAuth2 (GitHub, Azure AD) e MFA (inclui validação de `state` + PKCE).
3. Publicar pipelines de CI/CD com análise SAST/DAST (Snyk, OWASP Dependency-Check, ZAP) e secret scanning.
4. Estender a área administrativa com WYSIWYG seguro, workflows editoriais e dashboards descritos no roadmap público.
5. Instrumentar métricas históricas (OpenTelemetry/Prometheus) para alimentar gráficos de disponibilidade no `/status`.

---

> "Forjar aplicações seguras é uma jornada contínua. Este guia centraliza conhecimento, ferramentas e automações para proteger cada linha de código."  
> — Equipe Guia do Guerreiro AppSec
