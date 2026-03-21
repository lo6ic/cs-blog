# Christopher Schedler Blog

Personal website and blog built with Angular 16 and Scully. Blog posts live in [`posts/`](/Users/chrisschedler/Code/cs-blog/posts), and the deployable static site is generated into [`docs/`](/Users/chrisschedler/Code/cs-blog/docs) for GitHub Pages.

## Tech Stack

- Angular 16
- Scully 2
- TypeScript
- Tailwind CSS and DaisyUI
- GitHub Pages deployed through GitHub Actions

## Project Structure

- `src/`: Angular application source
- `posts/`: markdown blog posts consumed by Scully
- `.github/workflows/deploy.yml`: CI workflow that builds and deploys the site
- `scully.cs-blog.config.ts`: Scully prerender configuration
- `CNAME`: custom domain file copied into the deployed site
- `docs/`: generated static output for deployment

`docs/`, `dist/`, `.scully/settings.yml`, and `src/assets/scully-routes.json` are generated files and should not be treated as hand-edited source.

## Requirements

- Node.js `>= 21.5.0`
- npm
- Chrome or Chromium available locally for Scully prerendering

## Install

```bash
npm install --legacy-peer-deps
```

`--legacy-peer-deps` is currently required because `@scullyio/init` declares older peer dependency ranges than the rest of this Angular 16 toolchain.

## Local Development

For normal app development, run:

```bash
npm start
```

This starts the Angular dev server at `http://localhost:4200/`.

For a local preview of the generated static site, run:

```bash
npm run build:site
npm run preview
```

Use this when you want to verify what GitHub Pages will actually serve.

## Working With Blog Posts

Create a new post scaffold:

```bash
npm run post:new -- --name="Your Post Title"
```

Content workflow:

1. Add or update the generated markdown file in `posts/`
2. Set the front matter values you want published
3. Change `published` to `true` when the post is ready to go live
4. Remove or replace the default generated slug if needed
5. Run `npm run build:site` to regenerate the static output and verify the post locally

## Build Commands

Build the Angular app:

```bash
npm run build
```

Build the full deployable static site:

```bash
npm run build:site
```

That command clears the generated `docs/` output, runs the Angular production build, and then runs Scully.

Preview the generated static site locally:

```bash
npm run preview
```

## Deployment

Deployments are handled by GitHub Actions. Do not commit generated `docs/` output as part of a normal change.

Workflow summary:

1. A push to `master` or a manual workflow dispatch starts `.github/workflows/deploy.yml`
2. The workflow installs dependencies with `npm ci --legacy-peer-deps`
3. It installs Chrome on the runner for Puppeteer and Scully prerendering
4. It runs `npm run build:site`
5. It copies `CNAME` into `docs/CNAME`
6. It uploads `docs/` as the GitHub Pages artifact
7. GitHub Pages deploys the artifact

To deploy a code or content change:

1. Commit your source changes, markdown posts, and any source assets
2. Push to `master`
3. Watch the GitHub Actions run
4. Verify the GitHub Pages deployment completed successfully

## Testing

Run unit tests with Karma:

```bash
npm test
```

## Notes

- `docs/` and `dist/` are generated outputs and are ignored by git
- `src/assets/scully-routes.json` is regenerated during Scully builds
- The Scully config supports CI by accepting `PUPPETEER_EXECUTABLE_PATH` or `CHROME_BIN`
