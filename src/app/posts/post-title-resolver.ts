import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { POSTS_BY_ID } from '../content/generated/posts.generated';

@Injectable({
  providedIn: 'root',
})
export class PostTitleResolver implements Resolve<string> {
  resolve(route: ActivatedRouteSnapshot): string {
    const id = route.params['id'];
    return POSTS_BY_ID[id]?.title ?? 'Post';
  }
}
