import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';

import { CURRENT_BUILD_VERSION } from './build-info.generated';

interface AppVersionResponse {
  version?: string;
}

@Injectable({
  providedIn: 'root',
})
export class VersionRefreshService {
  private readonly reloadStorageKey = 'cs-blog-reloaded-for-version';

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  refreshWhenRouteIsStale(routePath: string): Subscription | undefined {
    if (!isPlatformBrowser(this.platformId)) {
      return undefined;
    }

    return this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (this.getPath(event.urlAfterRedirects) === routePath) {
          void this.reloadIfStale();
        }
      });
  }

  private async reloadIfStale(): Promise<void> {
    try {
      const response = await fetch(`/assets/app-version.json?ts=${Date.now()}`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        return;
      }

      const latest = (await response.json()) as AppVersionResponse;
      if (!latest.version || latest.version === CURRENT_BUILD_VERSION) {
        sessionStorage.removeItem(this.reloadStorageKey);
        return;
      }

      if (sessionStorage.getItem(this.reloadStorageKey) === latest.version) {
        return;
      }

      sessionStorage.setItem(this.reloadStorageKey, latest.version);
      window.location.reload();
    } catch {
      // Ignore update-check failures; stale content is preferable to broken navigation.
    }
  }

  private getPath(url: string): string {
    return url.split('?')[0].split('#')[0];
  }
}
