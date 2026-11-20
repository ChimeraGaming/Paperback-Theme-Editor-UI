# Checking the editor

## Automated tests

Use Node.js 24 or later. From the repository folder, run:

```text
node --test --test-isolation=none
```

`npm test` runs the same command. No packages need installing.

The suite covers:

- Theme imports and exports, including metadata and color precision.
- Invalid files, missing colors, and incomplete input.
- Separate light and dark values.
- Device proportions, rotation, available space, and relative iPad sizes.
- Named UTF-8 files, sharing support, cancellation, and share failures.

Fourteen tests passed on November 20, 2026 with Node.js 24.22.1.

## Browser checks

Start `node serve.mjs`, then open `http://127.0.0.1:4173`.

| Area | What to check |
| --- | --- |
| Colors | Hex and picker edits update the preview. Incomplete values keep the last valid color and block export. |
| Opacity | Presets and Custom work. Empty or invalid custom values block export until corrected. |
| Appearance | Light and Dark switch both the page and preview. The icon works by mouse and keyboard. The choice survives refresh. |
| Motion | Sun and moon rise over about 1.4 seconds while colors fade. Reduced-motion preferences disable the transition. |
| Drafts | Save, reload, and confirm both appearances and the file name return. |
| Files | Download, import that file, then export again. Compare the JSON, including extra fields. |
| Replacement | Import and Reset ask before replacing edited work. Cancelling leaves the current theme intact. |
| Preview | Check Home, Library, Search, title details, Settings, loading, and highlighting. |
| Devices | Change family and model, rotate, then refresh. Check that choices return and the screen keeps its proportions. |
| Tablet sizing | Compare mode keeps a mini smaller than a Pro. Fill mode enlarges each model independently. Open Duo gets the wider workspace. |
| Keyboard | Tab through controls. Focus must stay visible, and the phone content must scroll by keyboard. |

The browser review covered 320, 390, 768, 1024, and 1440 CSS-pixel widths.
Phone, iPad, and open Duo layouts fit without horizontal page overflow after
resizing settled. Mobile editor controls have at least 44-pixel tap targets.
At smaller widths, colors sit above the preview. Wider layouts place them side
by side. No browser console errors were reported during the review.

A download, import, and second export were compared at a 390-pixel viewport.
Both downloaded JSON objects matched. Share success, cancellation, unsupported
files, and errors are covered by tests using a simulated sharing API.

## GitHub Pages path

Run `node serve.mjs --pages` and open
`http://127.0.0.1:4173/Paperback-Theme-Editor-UI/`.

Check that styles, modules, the starter theme, and documentation load from the
repository path. The address without the trailing slash should redirect to it.
The local server should refuse requests for `.env`, `.git`, and private drafts.
These checks passed locally. No site has been deployed as part of development.

## iPhone checks before release

These steps still need Safari on a real iPhone, using the HTTPS Pages site:

1. Import a saved `.pbcolors` file from Files.
2. Edit both appearances and export.
3. If file sharing is supported, choose Save to Files in the share sheet.
4. Use Download file and find the download in Files as a separate check.
5. Share the file from Files with Paperback, if it appears as a destination.
6. Confirm Paperback applies the colors after installing the theme.

The editor cannot choose which apps appear in the share sheet or confirm a
Paperback installation. Available destinations depend on the browser, file
type, and installed app version. Cancelling a share leaves the theme in the
editor and does not start an unwanted download.

Device presets are layout references. Passing geometry tests does not verify
native Paperback behavior on every listed model. Compare the preview with the
app before claiming compatibility with a particular release.

## References

- [File-sharing support checks](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/canShare)
- [Sharing files from a user action](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)
- [Finding downloads in Files](https://support.apple.com/en-us/102440)
