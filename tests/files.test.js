import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createThemeFile, canShareFile, shareThemeFile } from '../src/files.js';
import { parseTheme } from '../src/theme.js';

const theme = parseTheme(await readFile(new URL('../examples/default.pbcolors', import.meta.url), 'utf8'));

/* ==============================
   MOBILE FILE TRANSFERS
   ============================== */

test('export creates a named UTF-8 pbcolors file that imports without changes', async () => {
  const withMetadata = structuredClone(theme);
  withMetadata.creator = 'Example with Unicode: café';
  const file = createThemeFile(withMetadata, 'My theme');
  assert.equal(file.name, 'My theme.pbcolors');
  assert.equal(file.type, 'application/octet-stream');
  assert.deepEqual(parseTheme(await file.text()), withMetadata);
});

test('unsupported file sharing and capability errors return a fallback result', async () => {
  const file = createThemeFile(theme, 'theme');
  for (const api of [null, {}, { share() {}, canShare: () => false }, { share() {}, canShare() { throw Error('unavailable'); } }]) {
    assert.equal(canShareFile(file, api), false);
    assert.equal(await shareThemeFile(file, api), 'unsupported');
  }
});

test('sharing passes the actual named file directly from the user action', async () => {
  const file = createThemeFile(theme, 'theme');
  let called = false;
  const promise = shareThemeFile(file, {
    canShare: data => data.files[0] === file,
    share(data) { called = true; assert.deepEqual(data, { files: [file] }); return Promise.resolve(); }
  });
  assert.equal(called, true);
  assert.equal(await promise, 'shared');
});

test('cancellation and sharing failures do not report success', async () => {
  const file = createThemeFile(theme, 'theme');
  for (const [name, result] of [['AbortError', 'cancelled'], ['NotAllowedError', 'failed'], ['DataError', 'failed']]) {
    assert.equal(await shareThemeFile(file, {
      canShare: () => true,
      share: () => Promise.reject(Object.assign(new Error(name), { name }))
    }), result);
  }
});
