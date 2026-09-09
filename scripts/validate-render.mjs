import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const projectRoot = resolve('.');
const errors = [];

function read(path) {
  const absolute = resolve(projectRoot, path);
  if (!existsSync(absolute)) {
    errors.push(`Arquivo obrigatório ausente: ${path}`);
    return '';
  }
  return readFileSync(absolute, 'utf8');
}

function requireMatch(content, pattern, message) {
  if (!pattern.test(content)) errors.push(message);
}

const blueprint = read('render.yaml');
const nodeVersion = read('.node-version').trim();
const packageMetadata = JSON.parse(read('package.json') || '{}');
const index = read('dist/index.html');
const thankYou = read('dist/obrigado/index.html');
read('dist/obrigado.js');
read('scripts/render-build.mjs');

if (nodeVersion !== '24.14.1') {
  errors.push(`.node-version deve fixar 24.14.1; valor atual: ${nodeVersion || 'vazio'}`);
}

if (packageMetadata.engines?.node !== '>=24.14.1 <25') {
  errors.push('package.json deve limitar Node a >=24.14.1 <25.');
}

requireMatch(blueprint, /type:\s*web/, 'render.yaml deve declarar type: web.');
requireMatch(blueprint, /runtime:\s*static/, 'render.yaml deve declarar runtime: static.');
requireMatch(
  blueprint,
  /staticPublishPath:\s*\.\/render-dist/,
  'render.yaml deve publicar ./render-dist.'
);
requireMatch(
  blueprint,
  /buildCommand:\s*["']npm ci --ignore-scripts && npm run render:verify["']/,
  'render.yaml deve executar o pipeline reproduzível de verificação.'
);
requireMatch(
  blueprint,
  /autoDeployTrigger:\s*checksPass/,
  'Deploy automático deve aguardar os checks.'
);
requireMatch(
  blueprint,
  /previews:\s*\n\s+generation:\s*automatic/,
  'Previews automáticos de pull request devem estar habilitados.'
);

for (const path of ['/obrigado', '/privacidade', '/termos', '/404']) {
  requireMatch(
    blueprint,
    new RegExp(`source:\\s*${path.replace('/', '\\/')}(?:\\s|$)`),
    `Rota Render ausente: ${path}`
  );
}

const routesBlock = blueprint.match(/\n\s+routes:\s*([\s\S]*?)\n\s+headers:/)?.[1] || '';
if (/source:\s*\/\*/.test(routesBlock)) {
  errors.push('Não use fallback SPA: ele esconderia o 404 real deste site multipágina.');
}

for (const header of [
  'Content-Security-Policy',
  'Strict-Transport-Security',
  'X-Content-Type-Options',
  'X-Frame-Options',
  'Referrer-Policy',
  'Permissions-Policy',
  'Cross-Origin-Opener-Policy'
]) {
  requireMatch(blueprint, new RegExp(`name:\\s*${header}`), `Header de segurança ausente: ${header}`);
}

for (const deprecated of ['autoDeploy:', 'pullRequestPreviewsEnabled:', '\\nenv:']) {
  if (new RegExp(deprecated).test(blueprint)) {
    errors.push(`Campo obsoleto detectado no render.yaml: ${deprecated.replace('\\n', '')}`);
  }
}

const inlineScripts = [...index.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)]
  .filter(match => !/\bsrc=/i.test(match[1]));

for (const [, attributes, content] of inlineScripts) {
  if (!/type=["']application\/ld\+json["']/i.test(attributes)) {
    errors.push('Script executável inline detectado em dist/index.html.');
    continue;
  }

  try {
    JSON.parse(content);
  } catch {
    errors.push('JSON-LD inválido em dist/index.html.');
  }

  const hash = createHash('sha256').update(content).digest('base64');
  if (!blueprint.includes(`'sha256-${hash}'`)) {
    errors.push(`CSP não autoriza o JSON-LD atual (sha256-${hash}).`);
  }
}

if (inlineScripts.length !== 1) {
  errors.push(`Era esperado exatamente um JSON-LD inline; encontrados: ${inlineScripts.length}.`);
}

if (/<script(?![^>]*\bsrc=)[^>]*>/i.test(thankYou)) {
  errors.push('A página de obrigado não pode conter JavaScript executável inline.');
}

requireMatch(
  thankYou,
  /<script\s+defer\s+src=["']\/obrigado\.js["']><\/script>/i,
  'A página de obrigado deve carregar /obrigado.js com defer.'
);

if (errors.length) {
  console.error(`Configuração Render inválida (${errors.length} erro(s)):`);
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}

console.log('Configuração Render validada: Blueprint, Node, rotas, CSP e headers estão coerentes.');
