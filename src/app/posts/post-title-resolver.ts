import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostTitleResolver implements Resolve<string> {
  resolve(route: ActivatedRouteSnapshot): string {
    let title = route.params['id']
      .replaceAll('-', ' ')
      .replace(
        /\w\S*/g,
        (text: string) =>
          text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
      );

    return `${title}`;
  }
}
