# APIs & Microserviços
APIs sustentam integrações críticas. Este capítulo cobre controles essenciais para arquiteturas distribuídas.

## Proteção de superfície
- Use gateways para centralizar autenticação, rate limiting e logging.
- Separe domínios para APIs internas e externas, evitando exposição inadvertida.
- Documente contratos com OpenAPI/AsyncAPI e valide entradas automaticamente.

## Autenticação e autorização
- Prefira OAuth2/OIDC para clientes externos e JWTs de curta duração.
- Utilize escopos e claims específicas para reduzir privilégios.
- Renove chaves e segredos periodicamente usando cofres dedicados.

## Observabilidade
- Crie trilhas de auditoria com correlação entre serviços (traceId, spanId).
- Configure alertas baseados em taxa de erro e latência suspeita.
- Analise padrões de tráfego para identificar abuso (ex.: scraping agressivo).

## Hardening de microserviços
- Utilize comunicação mTLS entre serviços sensíveis.
- Reduza a superfície habilitando apenas portas/rotas necessárias.
- Automatize testes de contrato e segurança a cada build.
