# Segurança

## Versões suportadas

Somente a versão atualmente publicada recebe correções de segurança.

## Como relatar

Não abra uma issue pública contendo vulnerabilidades, dados pessoais, credenciais ou informações comerciais sensíveis.

Use um aviso privado de segurança do GitHub ou o canal oficial da VOA FLEX quando ele estiver publicado. Inclua, sem inserir dados reais de clientes:

- descrição do problema;
- passos mínimos para reprodução;
- impacto observado;
- navegador e dispositivo;
- sugestão de correção, se houver.

## Dados e segredos

- Nunca versionar tokens, chaves, senhas ou arquivos `.env`.
- Dados submetidos em formulários não devem aparecer em logs ou exemplos.
- Integrações futuras devem usar variáveis de ambiente e privilégio mínimo.
- Toda coleta de dados deve ser revisada conforme a LGPD antes da publicação.

## Proteções do Render

O Blueprint aplica CSP, HSTS, proteção contra MIME incorreto, bloqueio de iframe, política de referência e restrições para câmera, microfone, localização, pagamentos e USB.

Qualquer analytics, pixel, CRM, fonte, imagem ou script externo novo exige revisão explícita da CSP. Não enfraquecer a política com curingas ou `unsafe-inline` apenas para contornar um erro de integração.
