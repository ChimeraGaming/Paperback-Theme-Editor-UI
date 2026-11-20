# Publish on GitHub Pages

The editor is a static site. GitHub Pages serves the HTML, CSS, JavaScript, and
starter theme. Editing colors, reading imports, saving drafts, and making
downloads all happen in the visitor's browser. Node.js is only used for local
development and tests.

## When you are ready

1. Upload the repository files to your `Paperback-Theme-Editor-UI` repository.
   Include `.nojekyll`, `index.html`, `styles.css`, `src/`, and `examples/`, along
   with the documentation, tests, and license files. Leave ignored files out.
2. Open the repository's **Settings**, then **Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the branch containing your files and choose **/(root)**. Save.
5. Wait for GitHub's Pages deployment to finish, then use the URL shown there.

For a repository named `Paperback-Theme-Editor-UI`, the usual project address is
`https://YOUR-USERNAME.github.io/Paperback-Theme-Editor-UI/`.

No custom Actions workflow, package installation, or build command is needed.
The `.nojekyll` file tells Pages to serve the static files without Jekyll.
These steps follow [GitHub's publishing source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
and [static site setup instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

## Check the repository path locally

Stop any running local server, then run:

```text
node serve.mjs --pages
```

Open `http://127.0.0.1:4173/Paperback-Theme-Editor-UI/`. This serves the same files
under a repository path. Check that the starter loads, colors update, imports
and exports work, and documentation links open. Ordinary local development
can still use `node serve.mjs`.

Keep all application URLs relative. A path such as `/src/app.js` would point to
the account's site root and break on a repository site.

## Drafts and public files

Local drafts do not move to the hosted site. Export a local draft and import it
on the Pages site. Drafts remain in the visitor's browser, not in GitHub.
Clearing browser data can remove them.

Everything uploaded to a public repository is public. `.gitignore` helps keep
local files out of Git, but it does not protect files uploaded manually or
already tracked. The development server's file allowlist does not apply on
GitHub Pages. Review the upload before publishing.

## After publishing

Open the Pages URL and repeat the import, export, and light/dark checks. Then
check Safari on the iPhone and install an exported theme in Paperback. Local
checks do not confirm that a hosted deployment or iPhone installation works.
