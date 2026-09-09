import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync
} from 'node:fs';
import { join, relative, resolve } from 'node:path';

const projectRoot = resolve('.');
const sourceDirectory = join(projectRoot, 'dist');
const publishDirectory = join(projectRoot, 'render-dist');
const packageMetadata = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf8'));

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const absolute = join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

if (!existsSync(join(sourceDirectory, 'index.html'))) {
  console.error('Build Render interrompido: dist/index.html não foi encontrado.');
  process.exit(1);
}

rmSync(publishDirectory, { recursive: true, force: true });
mkdirSync(publishDirectory, { recursive: true });
cpSync(sourceDirectory, publishDirectory, {
  recursive: true,
  dereference: false,
  preserveTimestamps: true
});

const commit = process.env.RENDER_GIT_COMMIT || process.env.GITHUB_SHA || 'local';
const deploy = process.env.RENDER_DEPLOY_ID || 'local';
const health = {
  status: 'ok',
  service: process.env.RENDER_SERVICE_NAME || 'voa-flex-site',
  version: packageMetadata.version,
  commit: /^[a-f0-9]{7,40}$/i.test(commit) ? commit.slice(0, 12) : 'local',
  deploy,
  generatedAt: new Date().toISOString()
};

writeFileSync(
  join(publishDirectory, 'health.json'),
  `${JSON.stringify(health, null, 2)}\n`,
  'utf8'
);

const requiredOutput = [
  'index.html',
  '404.html',
  'obrigado/index.html',
  'privacidade/index.html',
  'termos/index.html',
  'app.js',
  'obrigado.js',
  'styles.css',
  'premium.css',
  'health.json'
];

const missing = requiredOutput.filter(path => !existsSync(join(publishDirectory, path)));
if (missing.length) {
  console.error(`Build Render incompleto: ${missing.join(', ')}`);
  process.exit(1);
}

const files = walk(publishDirectory);
const totalBytes = files.reduce((total, file) => total + statSync(file).size, 0);
const relativeOutput = relative(projectRoot, publishDirectory) || 'render-dist';

console.log(
  `Pacote Render pronto: ${files.length} arquivos, ${(totalBytes / 1024 / 1024).toFixed(2)} MB em ${relativeOutput}/.`
);
