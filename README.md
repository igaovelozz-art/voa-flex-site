# VOA FLEX — Site institucional

Site institucional, comercial e de conversão da **VOA FLEX**, operação de logística Flex focada inicialmente na Zona Sul e Zona Oeste de São Paulo.

**Produção:** [voa-flex-sp.igorvelozz.chatgpt.site](https://voa-flex-sp.igorvelozz.chatgpt.site)

## Objetivo

Apresentar a proposta operacional da VOA FLEX com transparência e transformar o interesse de sellers de marketplace em uma conversa comercial qualificada.

O projeto prioriza:

- leitura rápida no celular;
- comunicação específica para sellers;
- teste piloto com parte do volume;
- diagnóstico e consulta preliminar de cobertura;
- simulação comercial sem expor margem interna;
- chatbot automatizado baseado apenas nas regras declaradas;
- SEO técnico, acessibilidade e desempenho;
- nenhuma promessa de estrutura, integração ou resultado ainda não comprovado.

## Funcionalidades

- Home responsiva com navegação sticky e CTAs contextuais.
- Arquitetura premium baseada no Padrão VOA e em aderência operacional.
- Diagnóstico operacional interativo em quatro etapas.
- Consulta preliminar de cobertura por CEP e perfil da operação.
- Calculadora de estimativa semanal e mensal.
- Formulário comercial preparado para WhatsApp.
- Assistente automatizado VOAÍ com base de respostas controlada.
- Jornada conceitual Entrada → Piloto → Seller VOA → Relacionamento recorrente → VOA Select.
- Sellers Fundadores, badge Seller Partner e VOA Circle com limites de promessa explícitos.
- Galeria com simulações fotográficas claramente identificadas.
- Páginas de obrigado, privacidade, termos e erro 404.
- Metadados Open Graph, Twitter Card, JSON-LD, sitemap e robots.
- Eventos preparados para futura instalação de analytics e pixels.

## Stack

Projeto estático sem dependências de execução:

- HTML5 semântico;
- CSS responsivo e mobile first;
- JavaScript moderno sem framework;
- imagens WebP e SVG otimizadas;
- hospedagem atual pelo ChatGPT Sites.

## Estrutura

```text
.
├── .github/                 # automações e modelos de colaboração
├── .openai/hosting.json     # configuração da hospedagem atual
├── dist/                    # versão publicável do site
│   ├── assets/              # identidade, logos e imagens
│   ├── 404/                 # rota amigável de erro
│   ├── obrigado/            # confirmação de conversão
│   ├── privacidade/         # política básica para revisão jurídica
│   └── termos/              # termos básicos para revisão jurídica
├── docs/                    # arquitetura, governança e publicação
├── render.yaml              # Blueprint de produção para o Render
├── scripts/                 # validação, build e servidor local
├── test/                    # verificações automatizadas
└── package.json
```

## Desenvolvimento local

Requisitos: Node.js 24.14.1. A versão é fixada em `.node-version` e limitada à linha 24 no `package.json`.

```bash
npm ci
npm run check
npm run serve
```

O servidor local abre em `http://127.0.0.1:4173` por padrão.

## Deploy no Render

O repositório inclui um Blueprint completo para publicar o projeto como Render Static Site:

```bash
npm ci --ignore-scripts
npm run render:verify
npm run serve:render
```

O processo valida o site e o Blueprint, gera um pacote isolado em `render-dist/` e cria o endpoint `/health.json`. Deploy automático só acontece depois dos checks, e pull requests recebem previews próprios.

Veja [Deploy no Render](docs/RENDER.md) para criação, verificação, segurança, domínio e rollback.

## Validação

`npm run check` verifica automaticamente:

- arquivos e rotas obrigatórias;
- referências locais quebradas;
- sintaxe do JavaScript;
- integridade estrutural do CSS;
- metadados essenciais de SEO;
- atributos alternativos das imagens;
- coerência das regras comerciais e operacionais públicas.

O mesmo comando é executado no GitHub Actions a cada push e pull request.

## Regras de conteúdo

Informações que dependem de confirmação — telefone, e-mail, CNPJ, endereço jurídico e controlador de dados — devem continuar marcadas como pendentes até serem oficialmente fornecidas.

Não publicar alegações de homologação, integração, tecnologia própria, GPS, aplicativo, clientes, volume entregue ou SLA sem comprovação documental.

Consulte [Governança de conteúdo](docs/CONTENT_GOVERNANCE.md) antes de alterar preços, cobertura ou promessas operacionais.

## Segurança e dados

O site atual não possui banco de dados nem autenticação. Os formulários processam dados no navegador e preparam a conversa comercial. Antes de adicionar backend, CRM, analytics ou pixels, revisar consentimento, retenção, finalidade e base legal conforme a LGPD.

## Direitos

Código e materiais proprietários. Veja [LICENSE](LICENSE).
