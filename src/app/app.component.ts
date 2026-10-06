import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';

import { SeoService } from './seo.service';
import { VersionRefreshService } from './version-refresh.service';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false,
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'cs-blog';

  private routerSubscription?: Subscription;
  private versionRefreshSubscription?: Subscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private seoService: SeoService,
    private versionRefreshService: VersionRefreshService,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngOnInit(): void {
    this.routerSubscription = this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
      )
      .subscribe((event) => {
        let route = this.activatedRoute;

        while (route.firstChild) {
          route = route.firstChild;
        }

        const seo = route.snapshot.data['seo'];

        if (seo) {
          this.seoService.update(seo);
        }

        if (isPlatformBrowser(this.platformId)) {
          window.gtag?.('event', 'page_view', {
            page_path: event.urlAfterRedirects,
            page_location: window.location.href,
            page_title: document.title,
          });
        }
      });

    if (isPlatformBrowser(this.platformId)) {
      this.versionRefreshSubscription =
        this.versionRefreshService.refreshWhenRouteIsStale('/resume');
    }
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
    this.versionRefreshSubscription?.unsubscribe();
  }
}
