import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import type { PostDocument, PostSummary } from './content.models';
import { POST_MANIFEST, POSTS_BY_ID } from './generated/posts.generated';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  getPostManifest(): Observable<PostSummary[]> {
    return of([...POST_MANIFEST]);
  }

  getPostById(id: string): Observable<PostDocument | null> {
    return of(POSTS_BY_ID[id] ?? null);
  }

  getPostSync(id: string): PostDocument | null {
    return POSTS_BY_ID[id] ?? null;
  }
}
