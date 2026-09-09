# Publicação

## Ambientes

- ChatGPT Sites: ambiente oficial atual; publica `dist/` conforme `.openai/hosting.json`.
- Render: ambiente preparado por `render.yaml`; publica o pacote gerado em `render-dist/`.

Os dois provedores usam a mesma fonte, mas o Render recebe uma cópia de build isolada. Isso impede que metadados gerados pelo provedor alterem os arquivos oficiais de `dist/`.

## Fluxo de release

1. Atualizar o número de versão no `package.json`.
2. Registrar as mudanças em `CHANGELOG.md`.
3. Executar `npm ci --ignore-scripts` e `npm run render:verify`.
4. Revisar a versão local em desktop e mobile.
5. Abrir pull request e obter aprovação.
6. Fazer merge na branch `main`.
7. Aguardar os checks do GitHub; o Render está configurado para publicar somente depois da aprovação técnica.
8. Publicar a versão aprovada no ambiente oficial desejado.
9. Validar URL, `/health.json`, formulário, chatbot, calculadora, 404, sitemap e robots.

O procedimento completo do Render está em [RENDER.md](RENDER.md).

## Rollback

Se uma publicação apresentar regressão:

1. interromper novas mudanças;
2. identificar a última versão estável;
3. republicar a versão estável pelo provedor;
4. corrigir em branch separada;
5. adicionar teste que cubra a regressão.

## Configurações futuras

Segredos e valores de runtime nunca devem ser incluídos no Git. Use o gerenciador seguro do provedor para chaves de analytics, CRM ou APIs.
