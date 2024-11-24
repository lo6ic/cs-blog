import { Component, OnInit } from '@angular/core';
import { ScullyRoute, ScullyRoutesService } from '@scullyio/ng-lib';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent implements OnInit {
  blogSrc = '../../assets/books.jpg';
  posts$: Observable<ScullyRoute[]> | undefined;
  constructor(private scullyService: ScullyRoutesService) {}
  ngOnInit(): void {
    let paraTop = document.getElementById('para-top');
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
  }
}
