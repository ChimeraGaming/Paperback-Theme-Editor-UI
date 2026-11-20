import { serializeTheme, themeFilename } from './theme.js';

/* ==============================
   THEME FILE TRANSFERS
   ============================== */

export function createThemeFile(theme, name) {
  // Keep the custom extension so installed apps can recognize a Paperback theme.
  return new File([serializeTheme(theme)], themeFilename(name), { type: 'application/octet-stream' });
}

export function canShareFile(file, api = globalThis.navigator) {
  try {
    return typeof api?.share === 'function' && typeof api?.canShare === 'function'
      && api.canShare({ files: [file] });
  } catch { return false; }
}

export async function shareThemeFile(file, api = globalThis.navigator) {
  if (!canShareFile(file, api)) return 'unsupported';
  try {
    // Call directly from the export click, before any asynchronous preparation.
    await api.share({ files: [file] });
    return 'shared';
  } catch (error) {
    return error?.name === 'AbortError' ? 'cancelled' : 'failed';
  }
}

export function downloadThemeFile(file) {
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  document.body.append(link);
  link.click();
  link.remove();
  // Allow slower mobile browsers time to consume the file URL.
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
