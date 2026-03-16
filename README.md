# Christopher Schedler Blog

Personal website and blog built with Angular 16 and Scully. The site publishes static pages to GitHub Pages and serves blog content from markdown files in [`posts/`](/Users/chrisschedler/Code/cs-blog/posts).

## What This Project Contains

- Marketing and profile pages for `About`, `Resume`, and `Contact`
- A blog index with search and pagination
- Individual blog post pages generated from markdown content
- Static site output generated into `docs/` for GitHub Pages deployment
- Google Analytics integration through `@hakimio/ngx-google-analytics`

## Tech Stack

- Angular 16
- Scully 2
- TypeScript
- Tailwind CSS and DaisyUI
- GitHub Actions for deployment
- GitHub Pages with a custom domain

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

Start the Angular development server:

```bash
npm start
```

This serves the app at `http://localhost:4200/`.

## Working With Blog Posts

Create a new post scaffold:

```bash
ng g @scullyio/init:post --name="Your Post Title"
```

Content workflow:

1. Add or update the generated markdown file in `posts/`
2. Set the front matter values you want published
3. Change `published` to `true` when the post is ready to go live
4. Remove or replace the default generated slug if needed
5. Rebuild the site with Scully to regenerate the static output

## Build Commands

Build the Angular app:

```bash
npm run build:prod
```

Generate the static site with Scully:

```bash
npm run scully
```

Clean and rebuild the deployable output:

```bash
npm run deploy:build
```

That script runs:

```bash
npm run scully:clean
npm run build:prod
npm run scully
```

Preview the generated static site locally:

```bash
npm run scully:serve
```

## Deployment

Deployments are handled by GitHub Actions, not by committing generated `docs/` files.

Workflow summary:

1. A push to `master` or a manual workflow dispatch starts `.github/workflows/deploy.yml`
2. The workflow installs dependencies with `npm ci --legacy-peer-deps`
3. It installs Chrome on the runner for Puppeteer and Scully prerendering
4. It runs the production Angular build and Scully generation steps
5. It copies `CNAME` into `docs/CNAME`
6. It uploads `docs/` as the GitHub Pages artifact
7. GitHub Pages deploys the artifact

Repository requirements for deploys:

- GitHub Pages must be configured to deploy from `GitHub Actions`
- The custom domain is sourced from the root `CNAME` file

For a normal content or code change, the deployment flow is:

1. Commit your source changes, post markdown, and any source assets
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
- Scully route data is generated during builds
- The Scully config supports CI by accepting `PUPPETEER_EXECUTABLE_PATH` or `CHROME_BIN`
