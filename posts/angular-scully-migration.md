---
title: "Migrating from Scully + Angular 16 to Angular 20 Prerender (Full Guide)"
description: "A step-by-step breakdown of migrating an Angular 16 + Scully static blog to Angular 20 using the built-in prerenderer, including common pitfalls and how to fix them."
published: true
datePublished: March 25, 2026
picture: "assets/posts/buildingblocks.jpg"
tags:
  - angular
  - angular-ssr
  - prerender
  - scully
  - static-site
  - web-development
---

### Migrating from Scully + Angular 16 to Angular 20 Prerender (Full Guide)

March 25, 2026

I recently migrated my blog from **Angular 16 + Scully** to **Angular 20 using the built-in prerenderer (SSR)**.

This wasn’t just a version bump — it was a **full architectural shift**:

- removing Scully
- upgrading Angular across multiple major versions
- rebuilding the content pipeline
- configuring SSR + prerender
- fixing several tricky runtime and build issues

In this post, I’ll walk through the **exact strategy**, the **problems I hit**, and how to solve them.

---

#### Step 1: Upgrade Angular Incrementally

The safest way to upgrade Angular across major versions is step-by-step:

```bash
npx @angular/cli@17 update @angular/core@17 @angular/cli@17
npx @angular/cli@19 update @angular/core@19 @angular/cli@19
npx @angular/cli@20 update @angular/core@20 @angular/cli@20
```

##### Problem

Scully depends on **older Angular and TypeScript versions**, which leads to errors like:

- incompatible peer dependencies
- TypeScript conflicts
- failed installs

##### Tip

👉 Let Scully break during the upgrade  
👉 Focus on getting Angular upgraded first  
👉 Plan to remove Scully afterward

---

#### Step 2: Accept That Scully Is the Bottleneck

At some point, it becomes clear:

> Scully is preventing modernization.

Common symptoms:

- peer dependency conflicts
- SSR build failures
- outdated TypeScript requirements

##### Decision

👉 Stop trying to fix Scully  
👉 Replace it with Angular’s built-in prerender

---

#### Step 3: Replace Scully with a Custom Content Pipeline

Scully previously handled:

- markdown parsing
- route generation
- static HTML injection

We replaced it with a custom pipeline:

```text
Markdown → Node script → Angular TypeScript → runtime rendering
```

##### Tools Used

- gray-matter (frontmatter parsing)
- markdown-it (markdown → HTML)

##### Result

A generated file like:

```text
src/app/content/generated/posts.generated.ts
```

Which contains:

- all blog posts
- metadata
- HTML content

---

#### Step 4: Introduce Angular SSR

Add SSR support:

```bash
ng add @angular/ssr
```

This generates:

- server.ts
- main.server.ts
- app.routes.server.ts

##### Key Concept

Angular now supports route-level rendering:

```ts
RenderMode.Prerender;
RenderMode.Client;
RenderMode.Server;
```

---

#### Step 5: Solve Prerender Route Extraction Failures

One of the most confusing errors:

```text
O4.match is not a function
```

##### Cause

Angular fails when trying to automatically expand dynamic routes like:

```ts
/posts/:id
```

##### Fix

Do not prerender dynamic routes:

```ts
{ path: 'posts/:id', renderMode: RenderMode.Client }
```

Only prerender static routes:

```ts
{ path: 'blog', renderMode: RenderMode.Prerender }
```

---

#### Step 6: Fix "document is not defined" (SSR Crash)

Error:

```text
ReferenceError: document is not defined
```

##### Why It Happens

SSR runs in Node.js, not the browser.

Browser-only APIs like:

- document
- window
- localStorage

are not available.

##### Fix

Guard all DOM access:

```ts
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

if (isPlatformBrowser(this.platformId)) {
  const el = document.getElementById('photo-top');
}
```

---

#### Step 7: Fix Angular Build Config Conflict

Warning encountered:

```text
The "prerender" option is not considered when "outputMode" is specified.
```

##### Root Cause

Angular ignores prerender settings when outputMode is set.

##### Fix

Remove:

```json
"outputMode": "static"
```

This allows Angular to properly execute prerendering.

---

#### Step 8: Switch to Static Output

Final build output:

```text
dist/<your-project>/browser
```

Preview locally:

```bash
npx http-server dist/<your-project>/browser
```

This replaces the old Scully docs/ directory entirely (I had Scully configured to generate into 'docs' directory).

---

#### Step 9: Update GitHub Pages Deployment

Old deployment:

```text
docs/
```

New deployment:

```text
dist/<your-project>/browser
```

##### Key Step

```bash
cp CNAME dist/<your-project>/browser/CNAME
```

---

#### Step 10: Clean Up Scully Completely

Delete leftover files:

- .scully/
- docs/
- scully.config.ts
- scully-routes.json

Remove:

- Scully dependencies
- Scully scripts

---

#### Common Pitfalls (and How to Avoid Them)

##### 1. Trying to Keep Scully During Upgrade

👉 Don’t. It will slow everything down.

---

##### 2. Letting Angular Auto-Discover Routes

👉 Can cause cryptic SSR crashes  
👉 Prefer explicit or hybrid routing

---

##### 3. Using Browser APIs in SSR

👉 Always guard with isPlatformBrowser

---

##### 4. Mismatched Node Version

Keep engines aligned:

```json
"node": ">=20 <23"
```

---

##### 5. Old Deployment Assumptions

Scully → docs/  
Angular prerender → dist/.../browser

---

#### Final Architecture

```text
Markdown → Generator → Angular → SSR → Prerender → Static Site
```

---

#### Final Thoughts

This migration was not trivial, but it was absolutely worth it.

You now have:

- modern Angular
- no third-party static generator
- faster builds
- full control over content
- a future-proof architecture

If you’re still on Scully:

Start planning your exit now.
