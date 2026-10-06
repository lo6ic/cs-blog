import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

interface SeoData {
  title: string;
  description: string;
  path: string;
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  private readonly siteUrl = 'https://christopherschedler.com';

  update(data: SeoData): void {
    this.title.setTitle(data.title);

    this.meta.updateTag({
      name: 'description',
      content: data.description,
    });

    this.updateCanonicalUrl(data.path);
  }

  private updateCanonicalUrl(path: string): void {
    const canonicalUrl = `${this.siteUrl}${this.normalizePath(path)}`;

    let canonical = this.document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );

    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      this.document.head.appendChild(canonical);
    }

    canonical.setAttribute('href', canonicalUrl);
  }

  private normalizePath(path: string): string {
    if (!path || path === '/') {
      return '/';
    }

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    return normalizedPath.endsWith('/') ? normalizedPath : `${normalizedPath}/`;
  }
}
