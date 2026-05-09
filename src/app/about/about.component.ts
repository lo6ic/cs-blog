import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css'],
    standalone: false
})
export class AboutComponent implements OnInit {
  aboutSrc = '../../assets/about.jpg';

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    let paraTop = document.getElementById('photo-top');
    if (paraTop) {
      paraTop.style.backgroundImage = 'url(' + this.aboutSrc + ')';
    }
  }
}
