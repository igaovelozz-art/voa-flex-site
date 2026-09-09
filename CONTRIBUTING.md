# Contribuição

Este é um projeto proprietário da VOA FLEX. Alterações exigem autorização e revisão antes de entrar em produção.

## Fluxo recomendado

1. Crie uma branch curta a partir de `main`.
2. Faça mudanças pequenas e relacionadas a um único objetivo.
3. Execute `npm run check`.
4. Abra um pull request com contexto, impacto visual e forma de validação.
5. Aguarde aprovação antes do merge e da publicação.

## Padrão de commits

Use mensagens objetivas no formato Conventional Commits:

```text
feat: adiciona nova funcionalidade
fix: corrige comportamento existente
docs: atualiza documentação
style: ajusta apresentação visual
refactor: reorganiza código sem mudar comportamento
test: adiciona ou corrige validações
chore: manutenção do projeto
```

## Critérios de revisão

- Sem informação comercial ou operacional inventada.
- Sem número de WhatsApp, e-mail, CNPJ ou endereço fictício.
- Layout funcional a partir de 320 px de largura.
- Navegação completa por teclado e foco visível.
- Imagens otimizadas, com texto alternativo apropriado.
- Nenhum segredo, token ou credencial no repositório.
- Links, formulários, calculadora e chatbot testados.
- Política de peso, cobertura, dias e preços mantida consistente.

## Pull requests

Inclua:

- motivo da mudança;
- telas ou seções afetadas;
- riscos e compatibilidade;
- evidência de `npm run check`;
- captura desktop e mobile quando houver mudança visual.
