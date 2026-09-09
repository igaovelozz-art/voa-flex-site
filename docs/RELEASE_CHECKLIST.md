# Checklist de release

## Conteúdo

- [ ] Ortografia revisada em português do Brasil.
- [ ] Preços usam “a partir de”.
- [ ] Cobertura é apresentada como inicial e sujeita à validação.
- [ ] Nenhuma integração, homologação, SLA ou estrutura foi inventada.
- [ ] Campos jurídicos pendentes continuam sinalizados.

## Experiência

- [ ] Navbar e logo aparecem completos.
- [ ] Desktop, tablet e celular foram revisados.
- [ ] Imagens mantêm cantos arredondados e texto alternativo.
- [ ] Foco de teclado e contraste continuam legíveis.
- [ ] Menu, FAQ, diagnóstico, calculadora, galeria e chatbot funcionam.

## Conversão

- [ ] Todos os CTAs levam ao destino correto.
- [ ] Formulários validam os campos obrigatórios.
- [ ] Mensagens automáticas correspondem ao CTA de origem.
- [ ] Nenhum número de WhatsApp fictício foi usado.

## Técnico

- [ ] `npm ci` concluído.
- [ ] `npm run check` concluído.
- [ ] `npm run render:verify` concluído.
- [ ] `render.yaml` validado e sem campos obsoletos.
- [ ] `/health.json` presente no pacote `render-dist/`.
- [ ] Sitemap, robots, canonical e Open Graph revisados.
- [ ] Página de obrigado e 404 verificadas.
- [ ] CHANGELOG e versão atualizados.
- [ ] Rollback conhecido antes da publicação.

## Render após o deploy

- [ ] Home, obrigado, privacidade e termos retornam status 200.
- [ ] Rota inexistente retorna status 404 real.
- [ ] CSP não bloqueia CSS, JavaScript, fontes ou imagens necessários.
- [ ] Preview de pull request não está indexável.
- [ ] Domínio canônico continua apontando para o ambiente principal aprovado.
