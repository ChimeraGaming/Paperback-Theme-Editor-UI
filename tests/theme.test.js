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
  assert.equal(roles.length, 11);
  assert.deepEqual(parseTheme(serializeTheme(theme)), theme);
});

test('editing preserves metadata, unknown nested fields, and the other appearance', () => {
  const theme = parseTheme(fixture);
  theme.creator = 'Example author';
  theme.extra = { values: ['keep', 12] };
  theme.accent.extra = true;
  theme.accent.lightColor.future = { label: 'keep' };
  const dark = structuredClone(theme.accent.darkColor);
  setHex(theme.accent.lightColor, '#1234AB');
  setAlpha(theme.accent.lightColor, '0.25');
  const restored = parseTheme(serializeTheme(theme));
  assert.deepEqual(restored, theme);
  assert.deepEqual(restored.accent.darkColor, dark);
  assert.equal(colorHex(restored.accent.lightColor), '#1234AB');
  assert.equal(restored.accent.lightColor.alpha, .25);
});

test('invalid formats are rejected with useful context', () => {
  for (const value of ['null', '[]', '{bad json']) assert.throws(() => parseTheme(value));
  const missing = parseTheme(fixture);
  delete missing.overlay.darkColor;
  assert.throws(() => parseTheme(JSON.stringify(missing)), /Loading overlay.*darkColor/);
  for (const value of [-1, 255, '0.5', null]) {
    const theme = parseTheme(fixture);
    theme.accent.lightColor.red = value;
    assert.throws(() => parseTheme(JSON.stringify(theme)), /Accent.*red.*0 to 1/);
  }
  const hex = parseTheme(fixture);
  hex.accent.lightColor.hexCode = '#ffffff';
  assert.throws(() => serializeTheme(hex), /hexCode/);
});

test('incomplete inputs leave the last valid color unchanged', () => {
  const color = parseTheme(fixture).accent.lightColor;
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

test('legacy files and drafts export current Paperback color names', () => {
  const legacy = JSON.parse(fixture);
  const theme = parseTheme(fixture);
  const exported = JSON.parse(serializeTheme(theme));
  assert.deepEqual(exported.accent, legacy.accentColor);
  assert.deepEqual(exported.primary, legacy.accentColor);
  assert.deepEqual(exported.primaryText, legacy.accentTextColor);
  assert.deepEqual(exported.background, legacy.backgroundColor);
  assert.equal(Object.hasOwn(exported, 'accentColor'), false);
  assert.equal(Object.hasOwn(exported, 'bodyTextColor'), false);
  assert.notEqual(theme.primary, theme.accent);
});

test('current keys, independent primary color and additional roles survive editing', () => {
  const current = parseTheme(fixture);
  current.primary.darkColor.red = .123;
  current.alertText = structuredClone(current.primaryText);
  current.tertiary = structuredClone(current.foreground);
  const restored = parseTheme(JSON.stringify(current));
  setHex(restored.accent.darkColor, '#112233');
  const exported = JSON.parse(serializeTheme(restored));
  assert.equal(exported.primary.darkColor.red, .123);
  assert.deepEqual(exported.alertText, current.alertText);
  assert.deepEqual(exported.tertiary, current.tertiary);
});

test('conflicting old and current role names are rejected without discarding data', () => {
  const mixed = JSON.parse(fixture);
  mixed.accent = mixed.accentColor;
  assert.throws(() => parseTheme(JSON.stringify(mixed)), /both accentColor and accent/);
});
