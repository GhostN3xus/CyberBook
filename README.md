# CyberBook v5 — Final

## Novidades
- **Cadastros**: Usuários, Aplicações, Responsáveis e Projetos (CRUD local via IndexedDB), export/import JSON.
- **Admin**: área autenticada com exportador geral e instruções de CSP report.
- **CSP Reporting**: `/api/csp-report` (POST) para receber relatórios (log-only).
- **News**: agregador RSS consolidado em `/api/news`.
- **Busca**: full-text local simples nos capítulos.
- **Terminal lúdico**: comandos fictícios para treinos, sem execução real.
- **Páginas vivas**: home, sobre, políticas e capítulos com markdown aprimorado.
- **CSP/Headers**: mesmos reforços (CSP rígida, COOP/COEP/CORP, HSTS...).

## Deploy (Azure SWA Free)
- App `/` • API `/api` • Output `/`
- Habilitar Authentication (GitHub)
- Rotas protegidas: `/editor/*`, `/admin/*`

## SAST em CI
- **CodeQL**: JS/TS com build leve
- **Semgrep**: regras OWASP Top 10 (semgrep registry), falha o pipeline em alerts "High"
