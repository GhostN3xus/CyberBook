# Sobre o CyberBook
O CyberBook nasceu como um guia enxuto para acelerar programas de segurança de aplicações em times enxutos. É pensado para ser consultado no dia a dia, com conteúdo sempre atualizado e ferramentas de apoio integradas.

## Princípios
- **Praticidade primeiro**: cada capítulo termina com uma lista de ações possíveis na vida real.
- **Security by design**: incentivamos decisões de segurança na fase de concepção e desenvolvimento, não apenas após o deploy.
- **Conteúdo vivo**: capítulos e apps recebem revisões frequentes de acordo com mudanças em normas, frameworks e ataques observados.

## Stack e arquitetura
O projeto é um front-end estático hospedado em Azure Static Web Apps com uma API leve em Node.js para feeds RSS e coleta de relatórios CSP. O armazenamento local (IndexedDB e LocalStorage) é utilizado para recursos offline como cadastros e anotações.

## Quem mantém
O conteúdo é mantido pela comunidade CyberBook. Sugestões de capítulos, correções ou novos labs podem ser enviados via issues ou pull requests.
