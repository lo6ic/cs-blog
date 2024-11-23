import { Component } from '@angular/core';
import { ScullyRoute, ScullyRoutesService } from '@scullyio/ng-lib';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent {
  posts$: Observable<ScullyRoute[]> | undefined;
  constructor(private scullyService: ScullyRoutesService) {}
  ngOnInit(): void {
    this.posts$ = this.scullyService.available$.pipe(
      map((posts) => {
        return Array.from(posts.values()).sort(
          (a, b) =>
            new Date(b['datePublished'])?.getTime() -
            new Date(a['datePublished'])?.getTime()
        );
      })
    );
  }
}
