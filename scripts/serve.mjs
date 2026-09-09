import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const rootArgument = process.argv.find(argument => argument.startsWith('--root='));
const requestedRoot = rootArgument?.slice('--root='.length) || process.env.STATIC_ROOT || 'dist';
const root = resolve(requestedRoot);
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || '127.0.0.1';

const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8'
};

function safePath(pathname) {
  const decoded = decodeURIComponent(pathname.split('?')[0]);
  const cleaned = normalize(decoded).replace(/^(\.\.[/\\])+/, '');
  const candidate = resolve(join(root, cleaned));
  return candidate.startsWith(root) ? candidate : null;
}

function resolveRequest(pathname) {
  let candidate = safePath(pathname);
  if (!candidate) return null;
  if (existsSync(candidate) && statSync(candidate).isDirectory()) candidate = join(candidate, 'index.html');
  if (!extname(candidate) && existsSync(`${candidate}.html`)) candidate = `${candidate}.html`;
  return existsSync(candidate) && statSync(candidate).isFile() ? candidate : null;
}

const server = createServer((request, response) => {
  const pathname = new URL(request.url || '/', `http://${request.headers.host || host}`).pathname;
  const requested = pathname === '/' ? '/index.html' : pathname;
  const file = resolveRequest(requested);
  const selected = file || join(root, '404.html');

  response.statusCode = file ? 200 : 404;
  response.setHeader('Content-Type', types[extname(selected).toLowerCase()] || 'application/octet-stream');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.setHeader('X-Frame-Options', 'DENY');
  response.setHeader('Cache-Control', /\/assets\//.test(pathname) ? 'public, max-age=3600' : 'no-cache');
  createReadStream(selected).pipe(response);
});

server.listen(port, host, () => {
  console.log(`VOA FLEX (${requestedRoot}) disponível em http://${host}:${port}`);
});
