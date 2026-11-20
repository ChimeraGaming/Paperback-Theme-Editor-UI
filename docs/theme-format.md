# Paperback theme format

Checked on November 20, 2026 against celarye/paperback-themes at revision
`6283ee041318cadad07f7c520e7a16ab2f30b589`.

Sources:

- [Writer: pbcolors.py](https://github.com/celarye/paperback-themes/blob/6283ee041318cadad07f7c520e7a16ab2f30b589/src/modules/pbcolors.py)
- [Roles and defaults: colors.py](https://github.com/celarye/paperback-themes/blob/6283ee041318cadad07f7c520e7a16ab2f30b589/src/modules/colors.py)
- [Normalized example](https://github.com/celarye/paperback-themes/blob/6283ee041318cadad07f7c520e7a16ab2f30b589/src/example-pbcolors/SRGBA.pbcolors)
- [Public theme with metadata](https://github.com/celarye/paperback-themes/blob/6283ee041318cadad07f7c520e7a16ab2f30b589/themes/catppuccin/mocha/blue/theme.pbcolors)

## Supported files

A `.pbcolors` file is JSON. The creator writes these ten top-level roles:

| Role | What it controls |
| --- | --- |
| `accentColor` | Main actions and selected controls |
| `accentTextColor` | Text and icons on the accent color |
| `foregroundColor` | Foreground surfaces and grouped rows |
| `backgroundColor` | Main background |
| `overlayColor` | Overlay while fetching updates |
| `separatorColor` | Thin dividing lines |
| `bodyTextColor` | Primary text |
| `subtitleTextColor` | Supporting text |
| `buttonNormalBackgroundColor` | Secondary action background |
| `buttonNormalTextColor` | Secondary action text and icons |

Each role has `lightColor` and `darkColor`. Each appearance has numeric `red`,
`green`, `blue`, and `alpha` channels, all from 0 to 1. For example, solid red is:

```json
{ "red": 1, "green": 0, "blue": 0, "alpha": 1 }
```

The local `examples/default.pbcolors` is an unchanged copy of the upstream
normalized example. Its license is included in `licenses/`.

## Import and export behavior

The editor requires all ten roles and both appearances. It accepts UTF-8 JSON,
including a leading byte-order mark, up to 1 MB. Invalid files leave the current
theme untouched.

Additional fields, including metadata such as `creator`, `description`, and
`source`, survive import and export at every level. They are not rendered as
HTML or followed as links. Whitespace and key formatting are not preserved.
As with normal JavaScript JSON handling, numeric metadata outside the safe
integer range may lose precision.

Untouched color values retain their parsed numeric precision. Hex and picker
edits replace only the selected role's RGB channels with 8-bit values divided
by 255. Opacity edits replace only alpha. The other appearance stays untouched.
The file name is local editor data and is not added to the theme JSON.

The upstream repository also has `HEXA` and `RGBA` examples. Some values are
inconsistent, including a five-digit hex value and mixed channel ranges.
This editor rejects hexCode objects and channels outside 0 to 1 rather than
guessing how they should be converted. An all-0-or-1 color cannot reveal
whether its author intended a normalized or 0 to 255 range; it is interpreted
as normalized, following the creator's output.

## Preview limits

The preview uses the ten roles in sample Home, Library, Search, title details, and settings
screens. Dashed selection outlines are editor annotations, not theme content.
Cover artwork is fixed sample content and is not recolored by the theme.

Home, Library, Search, title details, and settings layouts were revised using user-supplied
iPhone screenshots showing Paperback v0.9-r217. The screenshots stay outside
the repository. They show a custom dark theme; its actual theme file was not
supplied. The light appearance, transparency, system materials,
and assignment of theme roles to newer controls remain approximations. The
preview does not reproduce artwork blur or system glass effects. A valid round trip here proves
that the data is preserved, not that the theme installs in every app version.
Check the export in Paperback before publishing a theme.
