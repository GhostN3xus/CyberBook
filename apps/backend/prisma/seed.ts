import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@appsec.guide' },
    update: {},
    create: {
      email: 'admin@appsec.guide',
      password: await bcrypt.hash('ChangeMe123!', 12),
      role: 'admin'
    }
  });

  await prisma.vulnerability.upsert({
    where: { id: 'seed-cwe-79' },
    update: {},
    create: {
      id: 'seed-cwe-79',
      title: 'CWE-79 Cross-Site Scripting',
      summary: 'Scripts maliciosos executados no cliente.',
      cwe: 'CWE-79',
      risk: 'high',
      complexity: 'low',
      insecureCode: "<div>" + '{{userInput}}' + "</div>",
      secureCode: '<div>{sanitize(userInput)}</div>',
      remediation: 'Sanitize, encode e utilize CSP.',
      references: {
        create: [
          {
            label: 'OWASP XSS Prevention',
            url: 'https://owasp.org/www-community/xss-prevention'
          }
        ]
      }
    }
  });

  await prisma.officialDoc.upsert({
    where: { id: 'seed-node-doc' },
    update: {},
    create: {
      id: 'seed-node-doc',
      title: 'Node.js Security Best Practices',
      summary: 'Guia oficial para proteger aplicações Node.js.',
      url: 'https://nodejs.org/en/learn/getting-started/security-best-practices'
    }
  });

  await prisma.tool.upsert({
    where: { id: 'seed-zap' },
    update: {},
    create: {
      id: 'seed-zap',
      title: 'OWASP ZAP',
      summary: 'Scanner DAST open source.',
      vendor: 'OWASP',
      category: 'DAST',
      pricing: 'open-source',
      website: 'https://www.zaproxy.org'
    }
  });

  await prisma.article.upsert({
    where: { id: 'seed-article' },
    update: {},
    create: {
      id: 'seed-article',
      title: 'OWASP Top 10 resumo',
      summary: 'Visão geral dos principais riscos.',
      body: 'Detalhes sobre mitigação e prioridades.',
      tags: ['owasp', 'checklist']
    }
  });

  console.log('Seed executed with admin user', admin.email);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
