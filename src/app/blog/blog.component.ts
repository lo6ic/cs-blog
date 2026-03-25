import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';

import { ContentService } from '../content/content.service';
import type { PostSummary } from '../content/content.models';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
  standalone: false,
})
export class BlogComponent implements OnInit {
  blogSrc = '../../assets/books.jpg';
  posts$!: Observable<PostSummary[]>;

  // Pagination state
  pageSize = 10;
  private page$ = new BehaviorSubject<number>(1);
  currentPage$ = this.page$.asObservable();
  pagedPosts$!: Observable<PostSummary[]>;
  totalPages$!: Observable<number>;

  // Search state
  private search$ = new BehaviorSubject<string>('');
  currentSearch$ = this.search$.asObservable();
  private filteredPosts$!: Observable<PostSummary[]>;

  constructor(
    private contentService: ContentService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const paraTop = document.getElementById('photo-top');
    if (paraTop) {
      paraTop.style.backgroundImage = 'url(' + this.blogSrc + ')';
    }

    this.posts$ = this.contentService
      .getPostManifest()
      .pipe(
        map((posts) =>
          [...posts].sort(
            (a, b) =>
              new Date(b.datePublishedIso).getTime() -
              new Date(a.datePublishedIso).getTime(),
          ),
        ),
      );

    this.filteredPosts$ = combineLatest([this.posts$, this.search$]).pipe(
      map(([posts, term]) => {
        const q = term.toLowerCase().trim();
        if (!q) return posts;

        return posts.filter((p) => {
          const title = p.title.toLowerCase();
          const desc = p.description.toLowerCase();
          return title.includes(q) || desc.includes(q);
        });
      }),
    );

    this.totalPages$ = this.filteredPosts$.pipe(
      map((posts) => Math.max(1, Math.ceil(posts.length / this.pageSize))),
    );

    this.pagedPosts$ = combineLatest([this.filteredPosts$, this.page$]).pipe(
      map(([posts, page]) => {
        const start = (page - 1) * this.pageSize;
        return posts.slice(start, start + this.pageSize);
      }),
    );

    const qp = this.route.snapshot.queryParamMap;
    const initialPage = Number(qp.get('page'));
    if (!Number.isNaN(initialPage) && initialPage >= 1) {
      this.page$.next(initialPage);
    }

    const initialQuery = qp.get('q') ?? '';
    if (initialQuery) {
      this.search$.next(initialQuery);
    }
  }

  setPage(page: number, totalPages: number) {
    const next = Math.min(Math.max(1, page), totalPages);
    this.page$.next(next);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: next },
      queryParamsHandling: 'merge',
    });
  }

  onSearch(term: string) {
    this.search$.next(term);
    this.page$.next(1);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: term || null, page: 1 },
      queryParamsHandling: 'merge',
    });
  }

  pagesArray(total: number): number[] {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
}
