# Contributing

Pull requests are welcome. The maintainer reviews all contributions.

<details>
<summary>Humans</summary>

1. Keep changes focused and explain what they fix.
2. Use plain language, descriptive names, and readable code.
3. Keep the editor simple, accessible, and usable on phones and tablets.
4. Check your changes and report the results. Include screenshots for visible changes.
5. Keep secrets and personal information out of your pull request.

You can contribute directly without using an agent. If you use substantial
agent assistance, mention it and review the work before submitting.

</details>

<details>
<summary>Agents</summary>

1. Read [AGENTS.md](AGENTS.md) or [CLAUDE.md](CLAUDE.md). Both contain the same rules.
2. Keep changes within the requested scope and follow the existing style.
3. Check browser behavior, mobile layouts, and theme data when relevant.
4. Report what changed, what was checked, and any remaining limits.
5. Leave commits, pull request submission, and publishing to the maintainer
   unless explicitly instructed otherwise.

A human contributor must understand and review agent-assisted work before
submitting it. The same quality requirements apply to every pull request.

</details>

## Run and check

Use Node.js 24 or later. No packages need installing.

```text
node serve.mjs
node --test --test-isolation=none
```

See [docs/checks.md](docs/checks.md) for browser and iPhone checks.

## Theme files and assets

Use small public fixtures to check theme imports and exports. Preserve both
appearances, metadata, and untouched color precision. Record the source and
revision when changing format support.

Use original artwork or assets with permission to redistribute. Keep required
licenses and record reused work in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
Do not include secrets, personal information, or private theme drafts.

Contributions are submitted under the project's [MIT license](LICENSE). Each
contributor remains responsible for having permission to submit their work.
