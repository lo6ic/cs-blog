import { Component, OnInit } from '@angular/core';
import { ScullyRoute, ScullyRoutesService } from '@scullyio/ng-lib';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent implements OnInit {
  blogSrc = '../../assets/books.jpg';
  posts$!: Observable<ScullyRoute[]>;

  // Pagination state
  pageSize = 10;
  private page$ = new BehaviorSubject<number>(1);
  currentPage$ = this.page$.asObservable();
  pagedPosts$!: Observable<ScullyRoute[]>;
  totalPages$!: Observable<number>;

  // Search state
  private search$ = new BehaviorSubject<string>('');
  currentSearch$ = this.search$.asObservable();
  private filteredPosts$!: Observable<ScullyRoute[]>;

  constructor(
    private scullyService: ScullyRoutesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    let paraTop = document.getElementById('photo-top');
    if (paraTop) {
      paraTop.style.backgroundImage = 'url(' + this.blogSrc + ')';
    }

    this.posts$ = this.scullyService.available$.pipe(
      map((posts) => {
        return Array.from(posts.values()).sort(
          (a, b) =>
            new Date(b['datePublished'])?.getTime() -
            new Date(a['datePublished'])?.getTime()
        );
      })
    );

    // Filter posts by search term (title + description)
    this.filteredPosts$ = combineLatest([this.posts$, this.search$]).pipe(
      map(([posts, term]) => {
        const q = term?.toLowerCase().trim();
        if (!q) return posts;
        return posts.filter((p) => {
          const title = (p.title || '').toString().toLowerCase();
          const desc = (p['description'] || '').toString().toLowerCase();
          return title.includes(q) || desc.includes(q);
        });
      })
    );

    // Derive total pages from filtered posts
    this.totalPages$ = this.filteredPosts$.pipe(
      map((posts) => Math.max(1, Math.ceil(posts.length / this.pageSize)))
    );

    // Derive paged posts from filtered list
    this.pagedPosts$ = combineLatest([this.filteredPosts$, this.page$]).pipe(
      map(([posts, page]) => {
        const start = (page - 1) * this.pageSize;
        return posts.slice(start, start + this.pageSize);
      })
    );

    // Initialize current page from query param if present
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

  // Pagination controls
  setPage(page: number, totalPages: number) {
    const next = Math.min(Math.max(1, page), totalPages);
    this.page$.next(next);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: next },
      queryParamsHandling: 'merge',
    });
  }

  // Search
  onSearch(term: string) {
    this.search$.next(term);
    // Reset to first page on new search
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
