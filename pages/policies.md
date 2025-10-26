# Políticas
Estas políticas orientam o uso do CyberBook e dos recursos que acompanham a plataforma.

## Privacidade
- Não coletamos dados pessoais. Toda persistência ocorre no navegador do usuário via IndexedDB ou LocalStorage.
- Logs de API guardam apenas metadados operacionais (status, fonte da requisição e horário) para diagnóstico.
- Relatórios CSP enviados para `/api/csp-report` ficam restritos ao log do serviço e são descartados periodicamente.

## Segurança
- Aplicamos cabeçalhos rígidos (CSP, HSTS, COOP/COEP/CORP) e não carregamos scripts de terceiros.
- Contéudo dinâmico renderizado no app passa por sanitização básica antes de virar HTML.
- O código-fonte é analisado por CodeQL e Semgrep a cada push para evitar regressões de segurança.

## Contribuições
- Pull requests devem detalhar o impacto na experiência do usuário e incluir evidências de testes.
- Conteúdos novos precisam de referências e exemplos verificáveis.
- Ao relatar vulnerabilidades, utilize comunicação privada (security@cyberbook.example) antes de divulgar publicamente.
