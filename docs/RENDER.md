# Deploy no Render

O projeto está preparado para ser publicado como **Render Static Site** usando o Blueprint versionado em `render.yaml`.

## Arquitetura escolhida

| Item | Configuração |
| --- | --- |
| Serviço | Static Site (`type: web` + `runtime: static`) |
| Build | `npm ci --ignore-scripts && npm run render:verify` |
| Diretório publicado | `render-dist/` |
| Node.js | `24.14.1`, fixado em `.node-version` |
| Deploy automático | Somente após os checks passarem |
| Previews de pull request | Automáticos e separados da produção |
| TLS e CDN | Gerenciados pelo Render |

O site não precisa de Web Service, processo Node permanente, banco de dados ou disco. O Node é usado apenas durante o build para validar e preparar os arquivos estáticos.

## Criação pelo Blueprint

1. Envie o projeto completo para um repositório GitHub autorizado no Render.
2. No Dashboard do Render, escolha **New > Blueprint**.
3. Selecione o repositório da VOA FLEX.
4. Confirme que o Blueprint encontrado é `render.yaml`.
5. Revise o serviço `voa-flex-site` e aplique o Blueprint.
6. Aguarde o pipeline executar todas as validações e concluir o primeiro deploy.

Nenhum segredo ou variável confidencial é necessário para a versão estática atual.

## Configuração manual equivalente

Se o serviço for criado sem Blueprint, use:

- Language/Runtime: `Static Site`;
- Build Command: `npm ci --ignore-scripts && npm run render:verify`;
- Publish Directory: `render-dist`;
- Node Version: `24.14.1`;
- Auto Deploy: depois dos checks do GitHub;
- Pull Request Previews: automático.

Depois, replique no Dashboard as rotas e os headers declarados em `render.yaml`. O Blueprint é preferível porque mantém essas decisões revisáveis e versionadas.

## O que o build faz

1. valida todas as páginas, referências, imagens e scripts;
2. valida a configuração específica do Render;
3. gera uma cópia limpa de `dist/` em `render-dist/`;
4. cria `/health.json` com versão, commit e identificação do deploy;
5. falha antes da publicação se qualquer arquivo obrigatório estiver ausente.

`render-dist/` é descartável e não deve ser enviado ao Git. O Render sempre o reconstrói a partir do código versionado.

## Verificação após o deploy

Confirme estes endereços no domínio gerado pelo Render:

- `/` retorna a Home com status 200;
- `/obrigado` retorna a confirmação com status 200;
- `/privacidade` e `/termos` retornam status 200;
- `/health.json` retorna `status: ok` e a versão atual;
- `/uma-rota-inexistente` retorna status 404;
- CSS, JavaScript, logos e imagens carregam sem bloqueios de CSP;
- formulário, calculadora, chatbot, menu mobile e CTAs continuam funcionando.

## Domínio e SEO

Enquanto o Render for apenas um ambiente alternativo, os metadados canônicos permanecem apontando para o domínio oficial atual. Antes de tornar o Render o ambiente principal, atualize em conjunto:

- canonical e `og:url`;
- imagem Open Graph absoluta;
- JSON-LD;
- `sitemap.xml`;
- referência de sitemap em `robots.txt`.

Não publique dois domínios indexáveis como se ambos fossem a versão principal.

## Segurança e cache

O Blueprint aplica CSP, HSTS, proteção contra iframe, política de permissões e proteção de MIME. Assets usam cache moderado porque os nomes atuais não possuem hash de conteúdo. HTML e o endpoint de saúde permanecem revalidáveis.

Ao instalar analytics, pixels, CRM, chat externo ou outra integração, revise a CSP antes do deploy. Nunca adicione chaves privadas ao JavaScript servido ao navegador.

## Rollback

Em caso de regressão:

1. suspenda novos merges;
2. selecione no Render o último deploy bem-sucedido;
3. execute o rollback para esse deploy;
4. corrija em uma branch separada;
5. abra pull request e aguarde os checks antes do novo deploy.
