import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {
  aboutSrc = '../../assets/about.jpg';
  ngOnInit(): void {
    let paraTop = document.getElementById('para-top');
    if (paraTop) {
      paraTop.style.backgroundImage = 'url(' + this.aboutSrc + ')';
    }
  }
}
