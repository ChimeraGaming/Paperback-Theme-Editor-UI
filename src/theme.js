/* ==============================
   COLOR ROLES
   ============================== */

export const roles = [
  ['accentColor', 'Accent', 'Main actions, selected tabs, and highlighted controls.'],
  ['accentTextColor', 'Text on accent', 'Text and icons placed on the accent color.'],
  ['foregroundColor', 'Foreground', 'Navigation bars, grouped rows, and raised surfaces.'],
  ['backgroundColor', 'Background', 'The main surface behind the page content.'],
  ['overlayColor', 'Loading overlay', 'A translucent layer over content while updates load. Turn on the loading preview to see it.'],
  ['separatorColor', 'Separators', 'Thin lines between rows and sections.'],
  ['bodyTextColor', 'Body text', 'Titles, labels, and other primary text.'],
  ['subtitleTextColor', 'Secondary text', 'Descriptions, chapter counts, and supporting labels.'],
  ['buttonNormalBackgroundColor', 'Secondary button', 'The background of less prominent actions.'],
  ['buttonNormalTextColor', 'Secondary button text', 'Text and icons inside secondary buttons.']
];

export const modes = ['lightColor', 'darkColor'];
const channels = ['red', 'green', 'blue', 'alpha'];
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

/* ==============================
   FILE FORMAT
   ============================== */

export function parseTheme(text) {
  let theme;
  try { theme = JSON.parse(text.replace(/^\uFEFF/, '')); }
  catch { throw new Error('This file is not valid JSON. Choose a .pbcolors file exported by the Paperback theme creator.'); }
  return validateTheme(theme);
}

export function validateTheme(theme) {
  if (!isObject(theme)) throw new Error('The theme must be a JSON object.');
  for (const [key, label] of roles) {
    if (!Object.hasOwn(theme, key) || !isObject(theme[key])) {
      throw new Error(`Missing ${label} (${key}). All ten color roles are required.`);
    }
    for (const mode of modes) {
      const color = theme[key][mode];
      if (!Object.hasOwn(theme[key], mode) || !isObject(color)) {
        throw new Error(`${label} needs a ${mode} object.`);
      }
      if (Object.hasOwn(color, 'hexCode')) {
        throw new Error(`${label}, ${mode}: hexCode files are not supported. Use normalized red, green, blue, and alpha values from 0 to 1.`);
      }
      for (const channel of channels) {
        const value = color[channel];
        if (!Object.hasOwn(color, channel) || typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1) {
          throw new Error(`${label}, ${mode}: ${channel} must be a number from 0 to 1. The 0 to 255 format is not supported.`);
        }
      }
    }
  }
  return theme;
}

export function serializeTheme(theme) {
  validateTheme(theme);
  return JSON.stringify(theme, null, 2) + '\n';
}

/* ==============================
   COLOR CONVERSION
   ============================== */

export function colorHex(color) {
  return '#' + ['red', 'green', 'blue'].map(key => Math.round(color[key] * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
}

export function setHex(color, text) {
  if (!/^#?[\da-f]{6}$/i.test(text)) throw new Error('Enter six hex digits, such as #FD6A68.');
  const hex = text.replace(/^#/, '');
  ['red', 'green', 'blue'].forEach((key, index) => { color[key] = parseInt(hex.slice(index * 2, index * 2 + 2), 16) / 255; });
}

export function setAlpha(color, text) {
  if (String(text).trim() === '' || !Number.isFinite(Number(text)) || Number(text) < 0 || Number(text) > 1) {
    throw new Error('Enter opacity from 0 to 1, such as 0.3.');
  }
  color.alpha = Number(text);
}

export function colorCss(color) {
  return `rgb(${color.red * 255} ${color.green * 255} ${color.blue * 255} / ${color.alpha})`;
}

export function themeFilename(name) {
  const safe = name.replace(/\.pbcolors$/i, '').replace(/[^a-z0-9 _-]/gi, '').trim().slice(0, 80);
  return (safe || 'theme') + '.pbcolors';
}
