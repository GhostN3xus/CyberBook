# CyberBook Improvement Checklist

Este documento consolida uma avaliação do estado atual da plataforma CyberBook (frontend em Next.js e backend em NestJS) e lista iniciativas priorizadas para evoluir o produto com foco em segurança, experiência de uso e operação.

## Visão Geral

- **Auditoria**: revisão das principais áreas (segurança, produto, infraestrutura e dados) realizada em abril/2024.
- **Escopo**: aplicações `apps/frontend` e `apps/backend`, infraestrutura de build/deploy e documentação de suporte.
- **Metodologia**: análise de código, rotas expostas, experiência de navegação e comparação com melhores práticas OWASP/DevSecOps.

## Trilha de Melhorias

### 1. Fundamentos de Segurança

| Status | Ação | Observações |
| --- | --- | --- |
| ✅ | Sanitização do feed RSS e do armazenamento local de notas | Já implementado no frontend e APIs internas. |
| ✅ | Rate limiting global no backend e endpoint de relatório CSP | Configuração com `@nestjs/throttler` e `rate-limiter-flexible`. |
| 🚧 | Revisar implementação OAuth (state + PKCE) | Fluxo ainda não finalizado; precisa validar parâmetros de retorno. |
| 🚧 | Implantar CSP dinâmico com nonce no frontend | Backend já injeta nonce; frontend deve respeitar cabeçalho. |
| 🔜 | Integrar scanners automáticos (Snyk/OWASP Dependency-Check) | Preparar pipeline CI para rodar auditorias recorrentes. |

### 2. Observabilidade e Resiliência

| Status | Ação | Observações |
| --- | --- | --- |
| ✅ | Adicionar endpoint de health check público (`/health`) | Permite monitoramento por load balancers e uptime bots. |
| 🚧 | Logging estruturado e correlação de requisições | Definir formato único (p. ex., JSON) e propagar correlation-id. |
| 🔜 | Métricas de aplicação (Prometheus/OpenTelemetry) | Exportar indicadores de latência, throughput e erros. |
| 🔜 | Alertas automáticos para violações de CSP e falhas 5xx | Configurar integrações com SIEM / serviços de monitoramento. |

### 3. Experiência de Conteúdo

| Status | Ação | Observações |
| --- | --- | --- |
| ✅ | Criar página de roadmap público com progresso por trilha | Comunica próximos passos e status das iniciativas. |
| 🚧 | Internacionalizar todo o conteúdo dinâmico recém-adicionado | Alguns blocos estáticos ainda precisam de traduções. |
| 🔜 | Implementar área de estudo guiado com trilhas personalizadas | Dependente de design e modelagem no backend. |
| 🔜 | Lançar centro de download de artefatos (planilhas, scripts) | Necessário módulo de storage seguro. |

### 4. Operações e Confiabilidade

| Status | Ação | Observações |
| --- | --- | --- |
| 🚧 | Automatizar backups do banco e do conteúdo editorial | Atualmente manual, precisa de job agendado. |
| 🔜 | Implementar blue/green deployment com rollback rápido | Requer ajustes na infra de produção. |
| 🔜 | Formalizar runbooks de incidente e plano de continuidade | Documentação parcial no README; expandir em pasta `docs/`. |

## Páginas e Experiências Planejadas

1. **/roadmap** – Hub público com visão de progresso (implementado nesta entrega).
2. **/casos-de-uso** – Histórias aplicadas de AppSec por setor (planejado).
3. **/academy** – Módulos de treinamento com quizzes e certificados (planejado).
4. **/status** – Dashboard de disponibilidade com indicadores em tempo real (dependente de métricas).
5. **/relatorios** – Central de relatórios PDF e playbooks de resposta (planejado).

## Próximos Passos

- Monitorar uso do roadmap público para validar demanda por transparência.
- Priorizar implementação de PKCE/OAuth seguro antes de abrir o login social.
- Definir stack de observabilidade (p. ex. Elastic Stack + OpenTelemetry) e roadmap de métricas.
- Criar documentação complementar em `docs/` detalhando políticas de secrets, backup e incidentes.

---

> Atualizado em: 2024-04-12
