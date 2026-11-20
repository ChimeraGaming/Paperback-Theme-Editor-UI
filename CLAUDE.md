# Project and contribution rules

Led and maintained by ChimeraGaming. The maintainer sets the
direction and reviews contributions. Pull requests are welcome when they follow
these rules.

1. Keep changes focused. Submit work you understand and have checked.
2. Write plain language and readable code. Use descriptive names and consistent
   ASCII section comments. Avoid marketing filler, em dashes, and decorative arrows.
3. Keep the interface simple. Preserve the compact, centered layout and restrained
   controls. Avoid bubble layouts, decorative cards, and unnecessary effects.
4. Keep everything browser-based and compatible with GitHub Pages. Use relative
   paths. End users must not need an account, installation, backend, or upload.
5. Check phone, iPad, Duo, and desktop layouts. Support keyboard use, visible focus,
   readable text, mobile tap targets, and reduced motion.
6. Preserve light and dark colors, opacity, imported metadata, and untouched numeric
   precision. Validate imports, keep the .pbcolors extension, and check round trips.
   Confirm before replacing edited work.
7. Keep files and drafts on the user's device. Do not add tracking, accounts,
   external requests, or dependencies without the maintainer's agreement.
8. Keep secrets, personal data, private themes, downloads, caches, and generated
   output out of Git. Update .gitignore when needed. Use public test fixtures.
9. Preserve the MIT license, upstream notices, and credits. Use only assets you
   may redistribute. Do not imply affiliation with or endorsement by Paperback.
10. Run relevant checks and report the results honestly. Use Node.js 24 or later
    and `node --test --test-isolation=none`. Include screenshots for visible changes.
    Do not claim iPhone sharing or app installation works without a device check.
11. Explain new dependencies and changes to the theme format. Avoid unrelated
    rewrites. Keep documentation accurate and pull request descriptions concise.
12. Agents work locally. Leave commits, pushes, pull request submission, releases,
    and deployment to the maintainer unless explicitly instructed otherwise.

See [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/checks.md](docs/checks.md).
