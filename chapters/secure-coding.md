# Secure Coding
Boas práticas de desenvolvimento seguro reduzem custos de correção e aumentam a confiança no produto.

## Fundamentos
- Institua checklists de revisão que cubram validação de entrada, tratamento de erros e logging.
- Garanta que linters e formatadores rodem automaticamente no CI.
- Promova pareamentos regulares entre devs e especialistas de segurança.

## Gestão de segredos
- Utilize cofres (Azure Key Vault, HashiCorp Vault, AWS Secrets Manager) para armazenar credenciais.
- Nunca versione `.env` sensíveis; use variáveis de ambiente e pipelines seguros.
- Faça rotação programada e audite acesso a segredos críticos.

## Tratamento de erros
- Não exponha stack traces em produção. Retorne mensagens genéricas ao usuário.
- Estruture logs com níveis (`info`, `warn`, `error`) e contexto da requisição.
- Monitore exceções com ferramentas dedicadas (Sentry, Application Insights, etc.).

## Defesa contra XSS
- Escapamento contextual padrão em todas as saídas.
- Aplique Content Security Policy com `script-src 'self'` e uso opcional de Trusted Types.
- Evite `dangerouslySetInnerHTML` ou similares; use templates seguros.

## Pipeline seguro
- Inclua testes de segurança (SAST, SCA, IaC) no CI/CD.
- Use branches protegidos com revisão obrigatória e status checks.
- Automatize deploys com artefatos assinados e controle de versões.
