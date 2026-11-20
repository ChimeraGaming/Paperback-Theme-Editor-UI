# Paperback-Theme-Editor-UI

Make a Paperback theme in your browser and see the colors change as you edit.
Nothing to install, no account needed, and no file upload required.

## How to use it

Once the site is published, open it in your browser.

1. Start with the included theme, or optionally import your own `.pbcolors` file.
2. Choose Light or Dark and edit the colors and opacity.
3. Pick a device and preview Home, Library, Search, title details, or Settings.
4. Give your theme a file name and choose **Export .pbcolors**.

Both light and dark colors are included in the exported file. Imported files
are read on your device and are not uploaded to a server.

## On iPhone or iPad

Export opens the share sheet when supported. Choose Paperback if it appears,
or **Save to Files**. You can also download the file and share it from Files.
Keep the `.pbcolors` extension.

The editor saves a draft in your browser. Export a copy to keep it if you clear
browser data or change devices.

## About the preview

The preview is an approximation based on Paperback v0.9-r217 screenshots.
Check your finished theme in Paperback. Direct sharing and installation still
need testing on a real iPhone.

I am not affiliated with the Paperback team. This is an independent project
and is not an official or endorsed Paperback tool.

## Development

These commands are for contributors. People using the published site only
need a browser.

With Node.js 24 or later:

```text
node serve.mjs
```

Open [the local editor](http://127.0.0.1:4173). No packages or build step needed.

See [contributing](CONTRIBUTING.md), [tests](docs/checks.md), and
[GitHub Pages setup](docs/github-pages.md) for more information.

## Credits

Thanks to the [Paperback team](https://paperback.moe/) for the app and its theme
support, and to [Celarye](https://github.com/celarye) for the
[public themes and Python theme creator](https://github.com/celarye/paperback-themes).
That project provided the format reference and the starter colors used here.

Apple's device specifications helped with the preview sizes. Source links are
in the [device notes](docs/devices.md). The sample covers and titles were made
for this editor. See [third-party notices](THIRD_PARTY_NOTICES.md) for the
included theme's copyright and license.

## License and Paperback reuse

This project uses the [MIT license](LICENSE).

The Paperback team is welcome to use, modify, and include this code in
Paperback, including in a closed-source version. MIT already permits that,
provided the required copyright and license notices are retained.

If the team requests it, I am also open to discussing a closed-source future
version of this project. Existing MIT releases remain under MIT, and any
third-party code or contributions must keep the permissions their authors gave.
