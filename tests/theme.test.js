import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseTheme, serializeTheme, colorHex, setHex, setAlpha, themeFilename, roles } from '../src/theme.js';

const fixture = await readFile(new URL('../examples/default.pbcolors', import.meta.url), 'utf8');

/* ==============================
   FORMAT AND ROUND TRIPS
   ============================== */

test('upstream normalized fixture survives export and import without precision loss', () => {
  const theme = parseTheme(fixture);
  assert.equal(roles.length, 10);
  assert.deepEqual(parseTheme(serializeTheme(theme)), JSON.parse(fixture));
});

test('editing preserves metadata, unknown nested fields, and the other appearance', () => {
  const theme = parseTheme(fixture);
  theme.creator = 'Example author';
  theme.extra = { values: ['keep', 12] };
  theme.accentColor.extra = true;
  theme.accentColor.lightColor.future = { label: 'keep' };
  const dark = structuredClone(theme.accentColor.darkColor);
  setHex(theme.accentColor.lightColor, '#1234AB');
  setAlpha(theme.accentColor.lightColor, '0.25');
  const restored = parseTheme(serializeTheme(theme));
  assert.deepEqual(restored, theme);
  assert.deepEqual(restored.accentColor.darkColor, dark);
  assert.equal(colorHex(restored.accentColor.lightColor), '#1234AB');
  assert.equal(restored.accentColor.lightColor.alpha, .25);
});

test('invalid formats are rejected with useful context', () => {
  for (const value of ['null', '[]', '{bad json']) assert.throws(() => parseTheme(value));
  const missing = parseTheme(fixture);
  delete missing.overlayColor.darkColor;
  assert.throws(() => parseTheme(JSON.stringify(missing)), /Loading overlay.*darkColor/);
  for (const value of [-1, 255, '0.5', null]) {
    const theme = parseTheme(fixture);
    theme.accentColor.lightColor.red = value;
    assert.throws(() => parseTheme(JSON.stringify(theme)), /Accent.*red.*0 to 1/);
  }
  const hex = parseTheme(fixture);
  hex.accentColor.lightColor.hexCode = '#ffffff';
  assert.throws(() => serializeTheme(hex), /hexCode/);
});

test('incomplete inputs leave the last valid color unchanged', () => {
  const color = parseTheme(fixture).accentColor.lightColor;
  const before = structuredClone(color);
  for (const hex of ['#12', 'xyzxyz', '#FFFFFFF', '']) assert.throws(() => setHex(color, hex));
  for (const alpha of ['', ' ', '-.1', '1.1', 'NaN']) assert.throws(() => setAlpha(color, alpha));
  assert.deepEqual(color, before);
});

test('UTF-8 BOM and unknown prototype-like fields remain ordinary data', () => {
  const theme = parseTheme('\uFEFF' + fixture);
  const source = serializeTheme(theme).trimEnd().replace(/}$/, ', "__proto__": {"polluted": true}}');
  const restored = parseTheme(serializeTheme(parseTheme(source)));
  assert.deepEqual(restored.__proto__, { polluted: true });
  assert.equal({}.polluted, undefined);
});

test('download names stay usable and always end in .pbcolors', () => {
  assert.equal(themeFilename('../My:theme.pbcolors'), 'Mytheme.pbcolors');
  assert.equal(themeFilename('...'), 'theme.pbcolors');
});
