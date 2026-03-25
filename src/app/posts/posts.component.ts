import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const id = params['id'];
      const photoTop = document.getElementById('photo-top');

      this.contentService.getPostById(id).subscribe((post) => {
        this.post = post;

        if (photoTop) {
          if (post?.picture) {
            photoTop.style.backgroundImage = `url(${post.picture})`;
          } else {
            photoTop.style.backgroundImage = '';
          }
        }
      });
    });
  }
}
