import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const index = readFileSync('dist/index.html', 'utf8');
const app = readFileSync('dist/app.js', 'utf8');
const thankYou = readFileSync('dist/obrigado/index.html', 'utf8');
const renderBlueprint = readFileSync('render.yaml', 'utf8');
const nodeVersion = readFileSync('.node-version', 'utf8').trim();
const hosting = JSON.parse(readFileSync('.openai/hosting.json', 'utf8'));

test('usa português do Brasil e metadados essenciais', () => {
  assert.match(index, /<html lang="pt-BR">/);
  assert.match(index, /<meta name="viewport"/);
  assert.match(index, /<meta name="description"/);
  assert.match(index, /<link rel="canonical"/);
  assert.equal((index.match(/<h1\b/g) || []).length, 1);
});

test('mantém as regras comerciais públicas', () => {
  assert.match(index, /SHOPEE FLEX[\s\S]*?<sup>R\$<\/sup>\s*7<small>,00<\/small>[\s\S]*?a partir de/i);
  assert.match(index, /MERCADO LIVRE FLEX[\s\S]*?<sup>R\$<\/sup>\s*8<small>,00<\/small>[\s\S]*?a partir de/i);
  assert.match(index, /15 kg/i);
  assert.match(index, /Zona Sul/i);
  assert.match(index, /Zona Oeste/i);
  assert.match(index, /segunda a sábado/i);
  assert.doesNotMatch(index, /R\$\s*7,50/i);
});

test('não inventa um telefone comercial', () => {
  assert.match(app, /const WHATSAPP_NUMBER = '';/);
  assert.doesNotMatch(app, /wa\.me\/\d{10,}/);
});

test('declara as simulações fotográficas com transparência', () => {
  assert.match(index, /SIMULAÇÃO FOTOGRÁFICA/);
  assert.match(index, /Não são registros de uma unidade em funcionamento/);
});

test('mantém o posicionamento seletivo sem aprovação automática', () => {
  assert.match(index, /Logística Flex para sellers que levam/i);
  assert.match(index, /Não buscamos quantidade de sellers/i);
  assert.match(index, /VOA SELECT/i);
  assert.match(index, /VOA CIRCLE/i);
  assert.match(index, /nenhuma aprovação automática/i);
  assert.doesNotMatch(index, /últimas \d+ vagas|só restam \d+|lista de espera/i);
});

test('formulário de entrada coleta os dados operacionais necessários', () => {
  for (const field of ['dias_operacao', 'cutoff', 'volume_teste']) {
    assert.match(index, new RegExp(`name="${field}"`));
    assert.match(app, new RegExp(`data\\.${field}`));
  }
});

test('publica somente o diretório estático esperado', () => {
  assert.equal(hosting.static?.directory, 'dist');
});

test('prepara um pacote isolado para o Render', () => {
  assert.match(renderBlueprint, /runtime:\s*static/);
  assert.match(renderBlueprint, /staticPublishPath:\s*\.\/render-dist/);
  assert.match(renderBlueprint, /autoDeployTrigger:\s*checksPass/);
  assert.match(renderBlueprint, /generation:\s*automatic/);
  assert.equal(nodeVersion, '24.14.1');
});

test('mantém headers de produção no Blueprint', () => {
  for (const header of [
    'Content-Security-Policy',
    'Strict-Transport-Security',
    'X-Content-Type-Options',
    'X-Frame-Options',
    'Referrer-Policy',
    'Permissions-Policy'
  ]) {
    assert.match(renderBlueprint, new RegExp(`name:\\s*${header}`));
  }
});

test('remove JavaScript executável inline da página de obrigado', () => {
  assert.doesNotMatch(thankYou, /<script(?![^>]*\bsrc=)[^>]*>/i);
  assert.match(thankYou, /<script\s+defer\s+src="\/obrigado\.js"><\/script>/i);
});
