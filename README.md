# Christopher Schedler Blog

Personal website and blog built with Angular 21. Markdown posts in [`posts/`](posts/) are converted into a generated TypeScript content manifest, and Angular's built-in SSR/prerender pipeline produces the deployable static site in `dist/cs-blog/browser/`.

## Tech Stack

- Angular 21
- Angular SSR and prerendering (`@angular/ssr`, `@angular/build`)
- TypeScript
- Tailwind CSS and DaisyUI
- Markdown content parsed with the project's front-matter parser and `markdown-it`
- GitHub Pages deployed through GitHub Actions

## Project Structure

- [`src/`](src/): Angular application source
- [`posts/`](posts/): markdown blog post source files
- [`scripts/generate-post-content.mjs`](scripts/generate-post-content.mjs): generates the post manifest and prerender routes
- [`src/app/content/generated/posts.generated.ts`](src/app/content/generated/posts.generated.ts): generated post data consumed by the app
- [`prerender-routes.txt`](prerender-routes.txt): generated list of routes for Angular prerendering
- [`src/app/app.routes.server.ts`](src/app/app.routes.server.ts): server render configuration
- [`src/server.ts`](src/server.ts): Node/Express SSR entrypoint
- [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): CI workflow that builds and deploys to GitHub Pages
- [`CNAME`](CNAME): custom domain file copied into the published output

Generated output in `dist/` is build artifact only and should not be edited by hand.

## Requirements

- Node.js `^20.19.0`, `^22.12.0`, or `>=24.0.0`
- npm

Angular 21 supports the Node.js version ranges listed above. If you use `nvm`,
run `nvm use` from the repository root to switch to the version in `.nvmrc`.

Developed with 22.12.0 (use this version)

## Install

```bash
npm install
```

## Local Development

Run the Angular dev server:

```bash
npm start
```

This first regenerates the post content manifest and prerender routes, then starts the Angular dev server at `http://localhost:4200/`.

## Content Pipeline

Blog posts are authored as markdown files in [`posts/`](posts/). Before serving or building the app, the repository runs:

```bash
npm run content:generate
```

That script:

1. Reads every markdown file in `posts/`
2. Validates required front matter
3. Converts markdown to HTML
4. Excludes posts where `published: false`
5. Generates [`src/app/content/generated/posts.generated.ts`](src/app/content/generated/posts.generated.ts)
6. Generates [`prerender-routes.txt`](prerender-routes.txt)

Required front matter fields for each post:

- `title`
- `description`
- `published`
- `datePublished`
- `picture`

Posts can also include optional `displayOrder` front matter when more than one
post shares the same `datePublished`. Sorting checks the date first. Only when
two posts have the same date, the higher `displayOrder` appears first. For
example, `displayOrder: 2` appears before `displayOrder: 1` on the same day.

Post routes are derived from the markdown filename. For example, `posts/my-post.md` becomes `/posts/my-post`.

## Working With Blog Posts

To add a new post:

1. Create a new markdown file in [`posts/`](posts/)
2. Add the required front matter fields
3. Write the markdown body
4. Set `published: true` when the post is ready to appear in the blog and prerender output
5. Run `npm run content:generate` or any command that already includes it (`npm start` or `npm run build`)

Because filenames become route ids, rename the file if you want to change the final URL slug.

## Build And Preview

Create a production build:

```bash
npm run build
```

This regenerates post content, builds the Angular browser bundle, server bundle, and prerendered static pages.

Preview the generated static site locally:

```bash
npm run preview
```

This serves `dist/cs-blog/browser/` with `http-server`.

## Testing

Run unit tests with Vitest through Angular's unit-test builder:

```bash
npm test
```

## Deployment

Deployments are handled by [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

Workflow summary:

1. A push to `master` or manual workflow dispatch starts the Pages workflow
2. The workflow installs dependencies with `npm ci`
3. It runs `npm run build`
4. It copies [`CNAME`](CNAME) into `dist/cs-blog/browser/CNAME`
5. It uploads `dist/cs-blog/browser` as the GitHub Pages artifact
6. GitHub Pages deploys the artifact

## Notes

- [`src/app/content/generated/posts.generated.ts`](src/app/content/generated/posts.generated.ts) and [`prerender-routes.txt`](prerender-routes.txt) are generated files
- `dist/` is generated output and is ignored by git
- The app uses Angular hydration on the client and Express for the SSR entrypoint
- Google Analytics is configured in [`src/app/app.module.ts`](src/app/app.module.ts)

- To run the .ts scripts in /scripts/ use 'npx tsx scripts/<name>.ts' from the bash terminal
