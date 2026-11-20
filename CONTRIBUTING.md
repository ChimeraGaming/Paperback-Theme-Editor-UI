# Contributing

Use plain language, descriptive names, and consistent ASCII section comments. Keep the editor simple and accessible.

Keep changes focused. Explain the problem, what you changed, and how you checked
it. For visible changes, include a screenshot with no personal information.

Run `node serve.mjs` to open the editor locally. Run
`node --test --test-isolation=none` for automated checks. There are no packages
to install. See [docs/checks.md](docs/checks.md) for browser checks.

When changing theme handling, include a small public fixture and check that
importing and exporting preserves the supported values. Record the Paperback
format source and revision. Never use private theme drafts as test fixtures.

Use original artwork or assets with a license that permits redistribution.
Record copied or adapted work in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

Do not include secrets, generated output, dependency folders, or personal data.
The owner handles uploading and publishing this repository.
