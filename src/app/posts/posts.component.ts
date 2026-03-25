import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewEncapsulation,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { ContentService } from '../content/content.service';
import type { PostDocument } from '../content/content.models';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  preserveWhitespaces: true,
  encapsulation: ViewEncapsulation.Emulated,
  standalone: false,
})
export class PostsComponent implements OnInit {
  post: PostDocument | null = null;

  constructor(
    private contentService: ContentService,
    private activatedRoute: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const id = params['id'];

      this.contentService.getPostById(id).subscribe((post) => {
        this.post = post;

        if (isPlatformBrowser(this.platformId)) {
          const photoTop = document.getElementById('photo-top');

          if (photoTop) {
            if (post?.picture) {
              photoTop.style.backgroundImage = `url(${post.picture})`;
            } else {
              photoTop.style.backgroundImage = '';
            }
          }
        }
      });
    });
  }
}
