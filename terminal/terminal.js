(function(){
  const output = document.getElementById('terminalOutput');
  const form = document.getElementById('terminalForm');
  const input = document.getElementById('terminalInput');
  const prompt = 'guest@cyberbook:~$';
  const history = [];
  let historyIndex = -1;

  const responses = {
    'help': 'Comandos divertidos disponíveis:\n- help\n- ls\n- ls -la\n- whoami\n- uname -a\n- history\n- cat secrets.txt\n- sudo rm -rf /\n- ssh prod\n- curl https://cyberbook.local/api\n- clear',
    'ls': 'chapters\nnotes\npages\nterminal\nflag.txt*',
    'ls -la': 'total 42\ndrwxr-xr-x  2 guest guest 4096 jun 12 10:00 .\ndrwxr-xr-x 10 guest guest 4096 jun 12 09:50 ..\n-rw-r--r--  1 guest guest 1337 jun 12 09:59 manifesto.md\n-rw-r--r--  1 guest guest    0 jun 12 09:55 secrets.txt',
    'whoami': 'Você é um aprendiz de AppSec com superpoderes imaginários.',
    'uname -a': 'CyberBookOS 5.0.0 #1 SMP PREEMPT Tue Jun 11 10:42:00 UTC 2024 x86_64 Fun Machine',
    'cat secrets.txt': '⚠️ Nada de segredos reais aqui. Segurança começa evitando vazamentos fictícios também.',
    'sudo rm -rf /': 'Permissão negada. O SOC imaginário te viu chegando a tempo de evitar o desastre. Respira e revoga privilégios! ',
    'ssh prod': 'Conexão recusada: bastion exige MFA, piada interna e aprovação do chapéu azul.',
    'curl https://cyberbook.local/api': '{\n  "message": "Simulação bem sucedida",\n  "note": "APIs reais vivem atrás de autenticação."\n}',
    'history': () => history.map((cmd, idx) => `${idx + 1}  ${cmd}`).join('\n') || 'Ainda sem histórico. Execute alguns comandos primeiro.'
  };

  function scrollToBottom(){
    output.scrollTop = output.scrollHeight;
  }

  function appendLine(prefix, text){
    const line = document.createElement('div');
    line.className = 'terminalLine';
    if (prefix){
      const promptSpan = document.createElement('span');
      promptSpan.className = 'prompt';
      promptSpan.textContent = prefix;
      line.appendChild(promptSpan);
    }
    const textSpan = document.createElement('span');
    textSpan.textContent = text;
    line.appendChild(textSpan);
    output.appendChild(line);
  }

  function runCommand(raw){
    const command = raw.trim();
    if (!command){
      appendLine(prompt, '');
      scrollToBottom();
      return;
    }

    history.push(command);
    historyIndex = history.length;

    appendLine(prompt, command);

    const key = command.toLowerCase();
    if (key === 'clear'){
      output.innerHTML = '';
      scrollToBottom();
      return;
    }

    const handler = responses[key];
    let response;
    if (typeof handler === 'function'){
      response = handler();
    } else if (typeof handler === 'string'){
      response = handler;
    }

    if (!response){
      response = `bash: ${command}: comando não encontrado (mas valeu a criatividade!).`;
    }

    response.split('\n').forEach((line) => appendLine('', line));
    scrollToBottom();
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = input.value;
    input.value = '';
    runCommand(value);
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp'){
      if (history.length){
        historyIndex = historyIndex <= 0 ? 0 : historyIndex - 1;
        input.value = history[historyIndex] || history[0];
        event.preventDefault();
      }
    } else if (event.key === 'ArrowDown'){
      if (history.length){
        historyIndex = historyIndex >= history.length - 1 ? history.length : historyIndex + 1;
        input.value = historyIndex >= history.length ? '' : history[historyIndex];
        event.preventDefault();
      }
    }
  });

  appendLine('', 'Bem-vindo ao terminal lúdico do CyberBook! Nada aqui é executado de verdade, então pode testar à vontade.');
  appendLine('', 'Digite "help" para ver sugestões de comandos.');
  scrollToBottom();
})();
