# ConfigLab
O ConfigLab reúne receitas rápidas para reforçar ambientes de aplicação sem atrito com desenvolvimento.

## Cabeçalhos HTTP recomendados
```
Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self'; font-src 'self'; script-src 'self';
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## Checklist de deploy seguro
- Habilite HTTPS obrigatório no gateway ou CDN.
- Configure pipelines com verificação de integridade das imagens.
- Monitore CSP reports para identificar tentativas de XSS em produção.
- Ative `fail2ban` ou equivalentes para conter brute force em painéis administrativos.

## Parametrização de containers
- Fixe versões explícitas e utilize imagens minimalistas (distroless, alpine hardened).
- Rodar processos como usuário não root e com capabilities mínimas.
- Configure limites de CPU/memória e reinícios automáticos para evitar DoS simples.

## Ferramentas auxiliares
- Scripts de hardening disponíveis no repositório `/notes/configs` (personalize para sua stack).
- Use scanners IaC (tfsec, checkov) antes de aplicar mudanças em nuvens públicas.
