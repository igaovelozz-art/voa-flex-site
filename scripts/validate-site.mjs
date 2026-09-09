import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const projectRoot = resolve('.');
const dist = join(projectRoot, 'dist');
const errors = [];

function fail(message) {
  errors.push(message);
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const absolute = join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

const required = [
  'index.html',
  '404.html',
  '404/index.html',
  'obrigado/index.html',
  'privacidade/index.html',
  'termos/index.html',
  'styles.css',
  'premium.css',
  'app.js',
  'obrigado.js',
  'robots.txt',
  'sitemap.xml'
];

for (const path of required) {
  if (!existsSync(join(dist, path))) fail(`Arquivo obrigatório ausente: dist/${path}`);
}

const files = existsSync(dist) ? walk(dist) : [];
const htmlFiles = files.filter(file => extname(file) === '.html');

function resolveLocalReference(htmlFile, reference) {
  const clean = reference.split('#')[0].split('?')[0];
  if (!clean || /^(https?:|mailto:|tel:|data:|javascript:)/i.test(clean)) return null;
  let target = clean.startsWith('/') ? join(dist, clean) : resolve(dirname(htmlFile), clean);
  if (clean.endsWith('/')) target = join(target, 'index.html');
  return target;
}

for (const htmlFile of htmlFiles) {
  const html = readFileSync(htmlFile, 'utf8');
  const label = htmlFile.replace(`${projectRoot}/`, '');

  for (const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/gi)) {
    const target = resolveLocalReference(htmlFile, match[1]);
    if (target && !existsSync(target)) fail(`${label}: referência local inexistente (${match[1]})`);
  }

  for (const image of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\balt=["'][^"']*["']/i.test(image[0])) fail(`${label}: imagem sem atributo alt`);
  }

  for (const anchor of html.matchAll(/<a\b[^>]*target=["']_blank["'][^>]*>/gi)) {
    if (!/\brel=["'][^"']*noopener/i.test(anchor[0])) fail(`${label}: link externo sem rel=noopener`);
  }
}

for (const cssFile of files.filter(file => extname(file) === '.css')) {
  const css = readFileSync(cssFile, 'utf8');
  let depth = 0;
  for (const character of css) {
    if (character === '{') depth += 1;
    if (character === '}') depth -= 1;
    if (depth < 0) break;
  }
  if (depth !== 0) fail(`${cssFile.replace(`${projectRoot}/`, '')}: chaves desbalanceadas`);
}

for (const script of files.filter(file => extname(file) === '.js')) {
  const syntax = spawnSync(process.execPath, ['--check', script], { encoding: 'utf8' });
  if (syntax.status !== 0) {
    fail(`${script.replace(`${projectRoot}/`, '')}: ${syntax.stderr.trim() || 'erro de sintaxe'}`);
  }
}

for (const asset of files.filter(file => /\.(png|jpe?g|webp|svg)$/i.test(file))) {
  if (statSync(asset).size > 1_000_000) fail(`${asset.replace(`${projectRoot}/`, '')}: asset maior que 1 MB`);
}

if (errors.length) {
  console.error(`Validação falhou com ${errors.length} erro(s):`);
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Validação concluída: ${files.length} arquivos, ${htmlFiles.length} páginas HTML e nenhuma referência quebrada.`);
