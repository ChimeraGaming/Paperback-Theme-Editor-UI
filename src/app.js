import { roles, modes, parseTheme, colorHex, setHex, setAlpha, colorCss } from './theme.js';
import { previewMarkup } from './preview.js';
import { devices, fitDevice, tabletComparisonScale } from './devices.js';
import { createThemeFile, canShareFile, shareThemeFile, downloadThemeFile } from './files.js';

/* ==============================
   EDITOR STATE
   ============================== */

const $ = selector => document.querySelector(selector);
const draftKey = 'paperback-theme-editor-ui.draft.v1';
const appearanceKey = 'paperback-theme-editor-ui.appearance.v1';
const deviceKey = 'paperback-theme-editor-ui.device.v1';
let family = 'iPhone';
let model = 'iPhone 14 Pro';
let landscape = false;
let sizing = 'compare';
let appearanceTimer;
let theme;
let starter;
let mode = 'lightColor';
let screen = 'home';
let selected = 'accentColor';
let changed = false;
let draftSaved = true;
const invalid = new Set();

function status(message, error = false) {
  $('#status').textContent = message;
  $('#status').classList.toggle('error', error);
}

function saveDraft(announce = false) {
  try {
    localStorage.setItem(draftKey, JSON.stringify({ name: $('#theme-name').value, theme }));
    draftSaved = true;
    if (announce) status('Draft saved in this browser. Export a .pbcolors file to keep a separate copy.');
  } catch {
    draftSaved = false;
    status('This browser could not save the draft. Export a file to keep your work.', true);
  }
}

function updateExportState() {
  $('#export').disabled = invalid.size > 0;
  $('#download').disabled = invalid.size > 0;
  $('#save').disabled = invalid.size > 0;
}

function recordChange() {
  changed = true;
  saveDraft();
  if (draftSaved) status(invalid.size ? 'Fix the marked values before saving or exporting. The preview uses the last valid colors.' : 'Draft saved in this browser. Both appearances will be exported.', invalid.size > 0);
}

function canReplace() {
  return !(changed || invalid.size) || window.confirm('Replace the current theme? Export it first if you want to keep a separate copy. Incomplete entries will be discarded.');
}

/* ==============================
   COLOR CONTROLS AND INDEX
   ============================== */

function selectRole(key) {
  selected = key;
  const [, label, description] = roles.find(([role]) => role === key);
  $('#role-help-title').textContent = label;
  $('#role-help-text').textContent = description;
  document.querySelectorAll('#role-index a').forEach(link => link.setAttribute('aria-current', String(link.dataset.role === key)));
  document.querySelectorAll('.color-row').forEach(row => row.classList.toggle('selected', row.id === `role-${key}`));
  markPreview();
}

function buildIndex() {
  for (const [key, label] of roles) {
    const link = document.createElement('a');
    link.href = `#role-${key}`;
    link.textContent = label;
    link.dataset.role = key;
    link.addEventListener('click', () => {
      selectRole(key);
      $(`#role-${key}`).focus({ preventScroll: true });
    });
    $('#role-index').append(link);
  }
}

function buildFields() {
  $('#color-fields').replaceChildren();
  for (const [key, label, description] of roles) {
    const row = document.createElement('section');
    row.className = 'color-row';
    row.id = `role-${key}`;
    row.tabIndex = -1;
    row.innerHTML = `<h3>${label}</h3><p id="help-${key}">${description}</p>
      <div class="color-inputs">
        <label><span>Pick<span class="visually-hidden"> ${label}</span></span><input type="color" id="pick-${key}" aria-describedby="help-${key}"></label>
        <label for="hex-${key}">Hex<span class="visually-hidden"> ${label}</span><input class="hex-input" id="hex-${key}" spellcheck="false" autocomplete="off" maxlength="7" aria-describedby="help-${key} error-${key}"></label>
        <label for="opacity-${key}">Opacity<select id="opacity-${key}" aria-label="Opacity ${label}" aria-describedby="help-${key} error-${key}">
          ${[0, .1, .2, .25, .3, .4, .5, .6, .7, .75, .8, .9, 1].map(value => `<option value="${value}">${value === 0 ? '0 · Clear' : value === 1 ? '1 · Solid' : value}</option>`).join('')}
          <option value="custom">Custom</option></select>
          <input id="alpha-${key}" aria-label="Custom opacity ${label}" type="number" min="0" max="1" step="any" aria-describedby="help-${key} error-${key}" hidden></label>
      </div><p id="error-${key}" class="field-error" aria-live="polite"></p>`;
    const color = theme[key][mode];
    const picker = row.querySelector('input[type=color]');
    const hex = row.querySelector('.hex-input');
    const alpha = row.querySelector('input[type=number]');
    const opacity = row.querySelector('select');
    picker.value = colorHex(color);
    hex.value = colorHex(color);
    alpha.value = color.alpha;
    opacity.value = [...opacity.options].some(option => option.value === String(color.alpha)) ? String(color.alpha) : 'custom';
    alpha.hidden = opacity.value !== 'custom';
    const errors = new Map();
    function edit(input, action) {
      try {
        action();
        errors.delete(input.id);
        invalid.delete(input.id);
        input.removeAttribute('aria-invalid');
        updatePreviewColors();
        recordChange();
      } catch (error) {
        errors.set(input.id, error.message);
        invalid.add(input.id);
        input.setAttribute('aria-invalid', 'true');
        status('Fix the marked values before saving or exporting. The preview uses the last valid colors.', true);
      }
      row.querySelector('.field-error').textContent = [...errors.values()].join(' ');
      updateExportState();
    }
    hex.addEventListener('input', () => edit(hex, () => { setHex(color, hex.value); picker.value = colorHex(color); }));
    alpha.addEventListener('input', () => edit(alpha, () => setAlpha(color, alpha.value)));
    opacity.addEventListener('change', () => {
      alpha.hidden = opacity.value !== 'custom';
      if (opacity.value === 'custom') { alpha.focus(); return; }
      alpha.value = opacity.value;
      edit(alpha, () => setAlpha(color, opacity.value));
    });
    picker.addEventListener('input', () => edit(hex, () => { setHex(color, picker.value); hex.value = colorHex(color); }));
    row.addEventListener('focusin', () => selectRole(key));
    $('#color-fields').append(row);
  }
  selectRole(selected);
}

/* ==============================
   PREVIEW SCREENS
   ============================== */

function renderPreview() {
  $('#phone').innerHTML = `<div class="device-screen">${previewMarkup(screen, $('#loading').checked)}</div>`;
  $('#phone').querySelector('.device-screen').dataset.screen = screen;
  sizeDevice();
  updatePreviewColors();
  markPreview();
}

/* ==============================
   DEVICE SELECTION
   ============================== */

function populateModels() {
  $('#device-family').value = family;
  $('#device-model').replaceChildren(...devices[family].map(device => {
    const option = document.createElement('option');
    option.value = device.id;
    option.textContent = device.name;
    return option;
  }));
  if (!devices[family].some(device => device.id === model)) model = devices[family][0].id;
  $('#device-model').value = model;
}

function sizeDevice() {
  const device = devices[family].find(device => device.id === model);
  const expanded = family === 'iPad' || model === 'iPhone Duo (open)';
  $('.workspace').classList.toggle('tablet-layout', expanded);
  $('#sizing-control').hidden = family !== 'iPad';
  $('#preview-sizing').value = sizing;
  const maxHeight = Math.max(450, Math.min(720, window.innerHeight - 270));
  const { width, height, scale, outerWidth, outerHeight } = fitDevice(device, {
    landscape,
    availableWidth: $('.preview-mat').clientWidth,
    availableHeight: expanded ? Infinity : maxHeight,
    scaleLimit: family === 'iPad' && sizing === 'compare'
      ? tabletComparisonScale(device, { landscape, availableWidth: $('.preview-mat').clientWidth }) : 1
  });
  const phone = $('#phone');
  phone.dataset.frame = device.frame;
  phone.classList.toggle('wide-device', expanded);
  phone.style.width = `${outerWidth}px`;
  phone.style.height = `${outerHeight}px`;
  phone.style.setProperty('--device-width', `${width}px`);
  phone.style.setProperty('--device-height', `${height}px`);
  phone.style.setProperty('--device-scale', scale);
  phone.setAttribute('aria-label', `${device.name} Paperback-style preview`);
  $('#device-note').textContent = `${device.name}. ${width > height ? 'Landscape' : 'Portrait'}. ${width} x ${height} layout points, shown at ${Math.round(scale * 100)}%.${family === 'iPad' ? (sizing === 'compare' ? ' Shared screen-size comparison.' : ' Each model fills the available space.') : ''}`;
}

function changeDevice() {
  try { localStorage.setItem(deviceKey, JSON.stringify({ family, model, landscape, sizing })); }
  catch { status('Device changed, but this browser could not remember the choice.', true); }
  sizeDevice();
}

$('#device-family').addEventListener('change', event => {
  family = event.target.value;
  populateModels();
  changeDevice();
});
$('#device-model').addEventListener('change', event => { model = event.target.value; changeDevice(); });
$('#rotate-device').addEventListener('click', () => { landscape = !landscape; changeDevice(); });
$('#preview-sizing').addEventListener('change', event => { sizing = event.target.value; changeDevice(); });
new ResizeObserver(() => { if (theme) sizeDevice(); }).observe($('.preview-mat'));
window.addEventListener('resize', () => { if (theme) sizeDevice(); });

function updatePreviewColors() {
  for (const [key] of roles) $('#phone').style.setProperty(`--${key}`, colorCss(theme[key][mode]));
}

function markPreview() {
  const highlight = $('#highlight').checked;
  document.querySelectorAll('#phone [data-colors]').forEach(node => node.classList.toggle('marked', highlight && node.dataset.colors.split(' ').includes(selected)));
  const [, label, description] = roles.find(([key]) => key === selected);
  $('#selection-note').textContent = `${label}: ${description} ${highlight ? 'Dashed outlines mark the sample areas.' : 'Enable highlighting to mark the sample areas.'}`;
}

/* ==============================
   IMPORT, EXPORT, AND DRAFTS
   ============================== */

$('#import').addEventListener('click', () => { $('#file').value = ''; $('#file').click(); });
$('#file').addEventListener('change', async event => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    if (file.size > 1024 * 1024) throw new Error('Choose a theme smaller than 1 MB.');
    const imported = parseTheme(await file.text());
    if (!canReplace()) return;
    theme = imported;
    invalid.clear();
    $('#theme-name').value = file.name.replace(/\.(pbcolors|json)$/i, '');
    changed = false;
    buildFields();
    renderPreview();
    updateExportState();
    saveDraft();
    if (draftSaved) status('Theme imported. Extra fields and original color precision are preserved. Draft saved in this browser.');
  } catch (error) { status(`Import failed. ${error.message}`, true); }
});

function downloadTheme() {
  if (invalid.size) return;
  downloadThemeFile(createThemeFile(theme, $('#theme-name').value));
  changed = false;
  status('Download requested. On iPhone or iPad, check Safari Downloads or Files. Keep the .pbcolors extension, then share the file with Paperback.');
}

$('#download').addEventListener('click', downloadTheme);
$('#export').addEventListener('click', async () => {
  if (invalid.size) return;
  const file = createThemeFile(theme, $('#theme-name').value);
  if (!canShareFile(file)) { downloadTheme(); return; }
  const result = await shareThemeFile(file);
  if (result === 'shared') {
    changed = false;
    status('File handed to the share sheet. Use Paperback if listed, or Save to Files. This does not confirm installation in Paperback.');
  } else if (result === 'cancelled') {
    status('Sharing closed. Your theme is still here. Export again or choose Download file.');
  } else {
    $('#download').hidden = false;
    status('File sharing is unavailable. Choose Download file, then find the theme in Files or your browser downloads.', true);
  }
});

$('#save').addEventListener('click', () => saveDraft(true));
$('#theme-name').addEventListener('input', () => { if (theme) recordChange(); });
$('#reset').addEventListener('click', () => {
  if (!canReplace()) return;
  theme = structuredClone(starter);
  $('#theme-name').value = 'My theme';
  invalid.clear();
  changed = false;
  buildFields();
  renderPreview();
  updateExportState();
  saveDraft();
  if (draftSaved) status('Starter colors restored. Draft saved in this browser.');
});

function applyAppearance() {
  $('#appearance-toggle').setAttribute('aria-label', mode === 'darkColor' ? 'Switch to light appearance' : 'Switch to dark appearance');
  document.documentElement.dataset.appearance = mode === 'darkColor' ? 'dark' : 'light';
  document.querySelectorAll('[data-mode]').forEach(item => item.setAttribute('aria-pressed', String(item.dataset.mode === mode)));
  $('#mode-label').textContent = mode === modes[0] ? 'Light appearance' : 'Dark appearance';
  $('#preview-mode').textContent = mode === modes[0] ? 'Light' : 'Dark';
}

$('#appearance-toggle').addEventListener('click', () => {
  document.querySelector(`[data-mode="${mode === 'darkColor' ? 'lightColor' : 'darkColor'}"]`).click();
});

document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => {
  if (invalid.size) { status('Fix the marked values before switching appearances.', true); return; }
  if (mode === button.dataset.mode) return;
  clearTimeout(appearanceTimer);
  document.documentElement.classList.add('appearance-changing');
  // Enable the transition before applying the next palette.
  void document.documentElement.offsetWidth;
  mode = button.dataset.mode;
  applyAppearance();
  try { localStorage.setItem(appearanceKey, mode); }
  catch { status('Appearance changed, but this browser could not remember the choice for next time.', true); }
  buildFields();
  updatePreviewColors();
  appearanceTimer = setTimeout(() => document.documentElement.classList.remove('appearance-changing'), 1500);
}));

document.querySelectorAll('[data-screen]').forEach(button => button.addEventListener('click', () => {
  screen = button.dataset.screen;
  document.querySelectorAll('[data-screen]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  renderPreview();
}));
$('#loading').addEventListener('change', renderPreview);
$('#highlight').addEventListener('change', markPreview);
window.addEventListener('beforeunload', event => {
  if (invalid.size || !draftSaved) { event.preventDefault(); event.returnValue = ''; }
});

async function start() {
  try {
    const saved = JSON.parse(localStorage.getItem(deviceKey));
    if (saved && Object.hasOwn(devices, saved.family) && devices[saved.family].some(device => device.id === saved.model)) {
      family = saved.family;
      model = saved.model;
      landscape = saved.landscape === true;
      sizing = saved.sizing === 'fill' ? 'fill' : 'compare';
    }
  } catch { /* An unavailable or invalid saved choice uses the default device. */ }
  populateModels();
  try {
    const savedAppearance = localStorage.getItem(appearanceKey);
    if (modes.includes(savedAppearance)) mode = savedAppearance;
  } catch { /* Browsers that block storage can still use the editor. */ }
  applyAppearance();
  try {
    const response = await fetch('examples/default.pbcolors');
    if (!response.ok) throw new Error('The starter theme could not be loaded.');
    starter = parseTheme(await response.text());
    theme = structuredClone(starter);
    let message = 'Ready. Changes are saved in this browser. Export to keep a separate copy.';
    try {
      const saved = localStorage.getItem(draftKey);
      if (saved) {
        const draft = JSON.parse(saved);
        theme = parseTheme(JSON.stringify(draft.theme));
        if (typeof draft.name === 'string') $('#theme-name').value = draft.name;
        changed = true;
        message = 'Your saved draft has been restored. Both appearances are ready to edit.';
      }
    } catch {
      message = 'The saved draft could not be read. Starter colors loaded. Import a backup or begin a new theme.';
    }
    buildIndex();
    buildFields();
    renderPreview();
    ['import', 'export', 'download', 'save', 'reset'].forEach(id => { $(`#${id}`).disabled = false; });
    $('#download').hidden = !canShareFile(createThemeFile(theme, $('#theme-name').value));
    status(message);
  } catch (error) { status(`${error.message} Reload the page. If it still fails, check the setup instructions in the README.`, true); }
}

start();
