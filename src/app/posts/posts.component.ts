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

import { SeoService } from '../seo.service';

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
    private seoService: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const id = params['id'];

      this.contentService.getPostById(id).subscribe((post) => {
        this.post = post;
        if (post) {
          this.seoService.update({
            title: post.title,
            description: post.description,
            path: post.route,
          });
        }

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
