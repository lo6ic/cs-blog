import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ScullyRoute, ScullyRoutesService } from '@scullyio/ng-lib';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  preserveWhitespaces: true,
  encapsulation: ViewEncapsulation.Emulated,
})
export class PostsComponent implements OnInit {
  route: ScullyRoute | undefined;

  constructor(private scully: ScullyRoutesService, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    let photoTop = document.getElementById('photo-top');

    this.activatedRoute.params.subscribe(params => {
      this.scully.getCurrent().subscribe(route => {
        this.route = route;
        if(this.route['picture']){
          if(photoTop){
            photoTop.style.backgroundImage = 'url(' + this.route['picture'] + ')';
          }
        }
      });
    });
  }
}
