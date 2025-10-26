# OWASP Top 10 — visão prática
O Top 10 continua sendo a referência mais usada para introduzir riscos de aplicações web. Abaixo você encontra uma síntese prática com ações acionáveis.

## A01 — Broken Access Control
- Faça revisão de regras de autorização por rota e método HTTP.
- Automatize testes de IDOR com ferramentas como ZAP ou Burp.
- Registre tentativas de escalada de privilégio e use alertas em tempo real.

## A02 — Cryptographic Failures
- Imponha TLS forte (1.2+) com cipher suites modernas.
- Armazene senhas com Argon2id ou bcrypt com fator de custo adequado.
- Utilize cabeçalhos `Strict-Transport-Security` e `Expect-CT` quando aplicável.

## A03 — Injection
- Padronize parâmetros preparados e ORMs que previnem SQLi.
- Valide entrada com whitelists e normalize dados antes de persistir.
- Use bibliotecas que escapam automaticamente HTML, shell e LDAP.

## A04 — Insecure Design
- Realize threat modeling a cada feature crítica.
- Projete fluxos de recuperação seguros (reset de senha, MFA, bloqueios).
- Documente limites de abuso e automatize testes de segurança de negócio.

## A05 — Security Misconfiguration
- Versione configurações de infra e aplique “secure defaults”.
- Ative logs auditáveis e centralize-os com retenção definida.
- Mantenha imagens base mínimas e sem pacotes desnecessários.

## A06 — Vulnerable and Outdated Components
- Habilite scanners de dependências (SCA) e monitore CVEs críticas.
- Acompanhe boletins dos fornecedores e planeje janelas de atualização.
- Prefira imagens container base oficiais e com SBOM disponível.

## A07 — Identification and Authentication Failures
- Aplique MFA adaptativa para contas administrativas.
- Defina políticas de sessão seguras (`SameSite`, `Secure`, `HttpOnly`).
- Utilize fluxos OAuth2/OIDC padrão e bibliotecas mantidas.

## A08 — Software and Data Integrity Failures
- Assine artefatos e valide checksums em pipelines CI/CD.
- Utilize dependabot/renovate para atualizações controladas.
- Implemente revisionamento e aprovação dupla para mudanças críticas.

## A09 — Security Logging and Monitoring Failures
- Estruture logs com contexto (correlation-id, usuário, origem, ação).
- Monitore indicadores de abuso como brute force e fuzzing.
- Configure detecção e resposta baseada em risco, não apenas em volume.

## A10 — Server-Side Request Forgery
- Restrinja e segmente redes internas acessíveis pela aplicação.
- Valide URLs de saída contra allowlists.
- Utilize proxies de saída com autenticação e monitoramento.
