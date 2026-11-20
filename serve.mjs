import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

/* ==============================
   LOCAL SERVER
   ============================== */

// An explicit list keeps credentials and local drafts outside the web root.
const files = new Map([
  ['/', ['index.html', 'text/html']],
  ['/index.html', ['index.html', 'text/html']],
  ['/styles.css', ['styles.css', 'text/css']],
  ['/src/app.js', ['src/app.js', 'text/javascript']],
  ['/src/theme.js', ['src/theme.js', 'text/javascript']],
  ['/src/preview.js', ['src/preview.js', 'text/javascript']],
  ['/src/devices.js', ['src/devices.js', 'text/javascript']],
  ['/src/files.js', ['src/files.js', 'text/javascript']],
  ['/examples/default.pbcolors', ['examples/default.pbcolors', 'application/json']],
  ['/docs/theme-format.md', ['docs/theme-format.md', 'text/plain']],
  ['/README.md', ['README.md', 'text/plain']]
]);
const root = new URL('./', import.meta.url);
const mount = process.argv.includes('--pages') ? '/Paperback-Theme-Editor-UI' : '';
const server = createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405); response.end(); return; }
  const path = new URL(request.url, 'http://127.0.0.1').pathname;
  if (mount && path === mount) {
    response.writeHead(308, { Location: `${mount}/` });
    response.end();
    return;
  }
  const entry = files.get(mount ? (path.startsWith(`${mount}/`) ? path.slice(mount.length) : '') : path);
  if (!entry) { response.writeHead(404); response.end('Not found'); return; }
  try {
    const body = await readFile(fileURLToPath(new URL(entry[0], root)));
    response.writeHead(200, {
      'Content-Type': `${entry[1]}; charset=utf-8`,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'"
    });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch { response.writeHead(500); response.end('Could not read the requested file.'); }
});
server.on('error', error => { console.error(`Could not start the local editor: ${error.message}`); process.exitCode = 1; });
server.listen(4173, '127.0.0.1', () => console.log(`Paperback-Theme-Editor-UI: http://127.0.0.1:4173${mount}/`));
