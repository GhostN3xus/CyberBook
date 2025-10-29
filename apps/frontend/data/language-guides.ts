import type { VulnerabilityGuide } from '../types/content';

export const languageGuides: Record<string, VulnerabilityGuide[]> = {
  javascript: [
    {
      title: {
        pt: 'Injeção de comandos em Node.js',
        en: 'Command injection in Node.js'
      },
      summary: {
        pt: 'Uso inseguro de child_process com parâmetros concatenados.',
        en: 'Unsafe child_process usage with concatenated parameters.'
      },
      type: 'guide',
      cwe: 'CWE-78',
      owasp: ['A03:2021'],
      risk: 'critical',
      complexity: 'medium',
      insecureExample: {
        pt: "exec(`git clone ${repoUrl}`);",
        en: "exec(`git clone ${repoUrl}`);"
      },
      secureExample: {
        pt: "execFile('git', ['clone', repoUrl]);",
        en: "execFile('git', ['clone', repoUrl]);"
      },
      remediation: {
        pt: 'Valide entradas, utilize APIs seguras (execFile/spawn) e aplique allowlists.',
        en: 'Validate inputs, rely on safe APIs (execFile/spawn) and enforce allowlists.'
      },
      references: [
        {
          label: {
            pt: 'Node.js Security Best Practices',
            en: 'Node.js Security Best Practices'
          },
          url: 'https://nodejs.org/en/learn/getting-started/security-best-practices'
        }
      ]
    }
  ],
  python: [
    {
      title: {
        pt: 'Deserialização insegura com pickle',
        en: 'Unsafe deserialization with pickle'
      },
      summary: {
        pt: 'Objetos arbitrários podem ser executados ao desserializar dados não confiáveis.',
        en: 'Arbitrary objects may execute when deserializing untrusted data.'
      },
      type: 'guide',
      cwe: 'CWE-502',
      owasp: ['A08:2021'],
      risk: 'high',
      complexity: 'medium',
      insecureExample: {
        pt: 'pickle.loads(request.body)',
        en: 'pickle.loads(request.body)'
      },
      secureExample: {
        pt: 'Use json.loads ou libs seguras (serpy, marshmallow).',
        en: 'Use json.loads or hardened libraries (serpy, marshmallow).'
      },
      remediation: {
        pt: 'Evite pickle em dados externos, valide esquemas e aplique assinaturas.',
        en: 'Avoid pickle for untrusted data, validate schemas and enforce signatures.'
      },
      references: [
        {
          label: {
            pt: 'Python Security',
            en: 'Python Security'
          },
          url: 'https://docs.python.org/3/library/pickle.html#module-pickle'
        }
      ]
    }
  ],
  java: [
    {
      title: {
        pt: 'SQL Injection em JPA',
        en: 'SQL Injection in JPA'
      },
      summary: {
        pt: 'Consultas concatenadas com dados de usuário expõem o banco.',
        en: 'String concatenation in queries exposes the database.'
      },
      type: 'guide',
      cwe: 'CWE-89',
      owasp: ['A03:2021'],
      risk: 'critical',
      complexity: 'low',
      insecureExample: {
        pt: 'entityManager.createQuery("select u from User u where u.email = " + email)',
        en: 'entityManager.createQuery("select u from User u where u.email = " + email)'
      },
      secureExample: {
        pt: 'entityManager.createQuery("select u from User u where u.email = :email").setParameter("email", email)',
        en: 'entityManager.createQuery("select u from User u where u.email = :email").setParameter("email", email)'
      },
      remediation: {
        pt: 'Use parâmetros vinculados, valide entradas e monitore consultas.',
        en: 'Use bound parameters, validate inputs and monitor queries.'
      },
      references: [
        {
          label: {
            pt: 'Oracle Secure Coding',
            en: 'Oracle Secure Coding'
          },
          url: 'https://www.oracle.com/java/technologies/javase/seccodeguide.html'
        }
      ]
    }
  ],
  csharp: [
    {
      title: {
        pt: 'Cross-Site Scripting em Razor',
        en: 'Cross-Site Scripting in Razor'
      },
      summary: {
        pt: 'Renderização sem codificação gera execução de script.',
        en: 'Rendering without encoding triggers script execution.'
      },
      type: 'guide',
      cwe: 'CWE-79',
      owasp: ['A03:2021'],
      risk: 'high',
      complexity: 'low',
      insecureExample: {
        pt: '@Html.Raw(Model.Comment)',
        en: '@Html.Raw(Model.Comment)'
      },
      secureExample: {
        pt: '@Model.Comment',
        en: '@Model.Comment'
      },
      remediation: {
        pt: 'Habilite codificação automática, CSP e validação de entrada.',
        en: 'Enable automatic encoding, CSP and input validation.'
      },
      references: [
        {
          label: {
            pt: 'Microsoft Secure Coding',
            en: 'Microsoft Secure Coding'
          },
          url: 'https://learn.microsoft.com/aspnet/core/security/'
        }
      ]
    }
  ],
  go: [
    {
      title: {
        pt: 'Validação insuficiente em handlers HTTP',
        en: 'Insufficient validation in HTTP handlers'
      },
      summary: {
        pt: 'Parâmetros não verificados podem causar SSRF ou injeção.',
        en: 'Unchecked parameters can lead to SSRF or injection.'
      },
      type: 'guide',
      cwe: 'CWE-918',
      owasp: ['A10:2021'],
      risk: 'medium',
      complexity: 'medium',
      insecureExample: {
        pt: 'http.Get(r.URL.Query().Get("target"))',
        en: 'http.Get(r.URL.Query().Get("target"))'
      },
      secureExample: {
        pt: 'Validar URLs com allowlist e usar contextos com timeout.',
        en: 'Validate URLs with allowlists and use contexts with timeout.'
      },
      remediation: {
        pt: 'Implemente validação estruturada, sanitize entradas e monitore tráfego de saída.',
        en: 'Implement structured validation, sanitize input and monitor egress traffic.'
      },
      references: [
        {
          label: {
            pt: 'Go Secure Coding',
            en: 'Go Secure Coding'
          },
          url: 'https://github.com/OWASP/Go-SCP'
        }
      ]
    }
  ],
  php: [
    {
      title: {
        pt: 'Upload de arquivos sem validação',
        en: 'Unvalidated file upload'
      },
      summary: {
        pt: 'Falha em restringir uploads permite execução remota de código.',
        en: 'Failing to restrict uploads allows remote code execution.'
      },
      type: 'guide',
      cwe: 'CWE-434',
      owasp: ['A05:2021'],
      risk: 'critical',
      complexity: 'medium',
      insecureExample: {
        pt: '$name = $_FILES["file"]["name"]; move_uploaded_file($_FILES["file"]["tmp_name"], "/uploads/$name");',
        en: '$name = $_FILES["file"]["name"]; move_uploaded_file($_FILES["file"]["tmp_name"], "/uploads/$name");'
      },
      secureExample: {
        pt: 'Validar MIME, renomear arquivos e armazenar fora da raiz pública.',
        en: 'Validate MIME types, rename files and store outside the public root.'
      },
      remediation: {
        pt: 'Implemente varredura de malware, limitação de extensão e políticas de retenção.',
        en: 'Enable malware scanning, extension limiting and retention policies.'
      },
      references: [
        {
          label: {
            pt: 'PHP Security Best Practices',
            en: 'PHP Security Best Practices'
          },
          url: 'https://www.php.net/manual/en/security.php'
        }
      ]
    }
  ],
  ruby: [
    {
      title: {
        pt: 'Mass Assignment em Rails',
        en: 'Mass Assignment in Rails'
      },
      summary: {
        pt: 'Parâmetros desprotegidos permitem alteração de campos sensíveis.',
        en: 'Unprotected parameters allow sensitive fields to be altered.'
      },
      type: 'guide',
      cwe: 'CWE-915',
      owasp: ['A05:2021'],
      risk: 'high',
      complexity: 'low',
      insecureExample: {
        pt: 'User.new(params[:user])',
        en: 'User.new(params[:user])'
      },
      secureExample: {
        pt: 'params.require(:user).permit(:email, :name)',
        en: 'params.require(:user).permit(:email, :name)'
      },
      remediation: {
        pt: 'Utilize strong parameters, validações de modelo e testes automatizados.',
        en: 'Use strong parameters, model validations and automated tests.'
      },
      references: [
        {
          label: {
            pt: 'Rails Security Guide',
            en: 'Rails Security Guide'
          },
          url: 'https://guides.rubyonrails.org/security.html'
        }
      ]
    }
  ],
  ccpp: [
    {
      title: {
        pt: 'Buffer Overflow clássico',
        en: 'Classic Buffer Overflow'
      },
      summary: {
        pt: 'Manipulação de buffers sem limites causa corrupção de memória.',
        en: 'Buffer handling without bounds causes memory corruption.'
      },
      type: 'guide',
      cwe: 'CWE-120',
      owasp: ['A06:2021'],
      risk: 'critical',
      complexity: 'medium',
      insecureExample: {
        pt: 'char buf[8]; gets(buf);',
        en: 'char buf[8]; gets(buf);'
      },
      secureExample: {
        pt: 'char buf[8]; fgets(buf, sizeof buf, stdin);',
        en: 'char buf[8]; fgets(buf, sizeof buf, stdin);'
      },
      remediation: {
        pt: 'Use funções seguras, sanitização e ferramentas de análise estática.',
        en: 'Use safe functions, sanitization and static analysis tools.'
      },
      references: [
        {
          label: {
            pt: 'SEI CERT C Coding Standard',
            en: 'SEI CERT C Coding Standard'
          },
          url: 'https://wiki.sei.cmu.edu/confluence/display/c'
        }
      ]
    }
  ],
  rust: [
    {
      title: {
        pt: 'Uso incorreto de unsafe block',
        en: 'Improper unsafe block usage'
      },
      summary: {
        pt: 'Violação do borrow checker causa comportamento indefinido.',
        en: 'Violating the borrow checker leads to undefined behavior.'
      },
      type: 'guide',
      cwe: 'CWE-242',
      owasp: ['A06:2021'],
      risk: 'medium',
      complexity: 'high',
      insecureExample: {
        pt: 'unsafe { let mut_ref = &mut *(ptr as *mut i32); }',
        en: 'unsafe { let mut_ref = &mut *(ptr as *mut i32); }'
      },
      secureExample: {
        pt: 'Prefira abstrações seguras (Rc<RefCell<T>>) ou crates auditadas.',
        en: 'Prefer safe abstractions (Rc<RefCell<T>>) or audited crates.'
      },
      remediation: {
        pt: 'Limite unsafe, documente invariantes e execute cargo miri/clippy.',
        en: 'Minimize unsafe, document invariants and run cargo miri/clippy.'
      },
      references: [
        {
          label: {
            pt: 'Rustonomicon',
            en: 'Rustonomicon'
          },
          url: 'https://doc.rust-lang.org/nomicon/'
        }
      ]
    }
  ],
  mobile: [
    {
      title: {
        pt: 'Armazenamento inseguro em mobile',
        en: 'Insecure storage on mobile'
      },
      summary: {
        pt: 'Credenciais salvas em texto puro no dispositivo expõem contas.',
        en: 'Plaintext credentials stored on device expose accounts.'
      },
      type: 'guide',
      cwe: 'CWE-922',
      owasp: ['M2:2023'],
      risk: 'high',
      complexity: 'medium',
      insecureExample: {
        pt: 'UserDefaults.standard.set(password, forKey: "pwd")',
        en: 'UserDefaults.standard.set(password, forKey: "pwd")'
      },
      secureExample: {
        pt: 'Use Keychain (iOS) ou EncryptedSharedPreferences (Android).',
        en: 'Use Keychain (iOS) or EncryptedSharedPreferences (Android).'
      },
      remediation: {
        pt: 'Proteja dados em repouso com hardware-backed keystore e biometria.',
        en: 'Protect data at rest with hardware-backed keystores and biometrics.'
      },
      references: [
        {
          label: {
            pt: 'OWASP MASVS',
            en: 'OWASP MASVS'
          },
          url: 'https://mas.owasp.org/MASTG/'
        }
      ]
    }
  ]
};
