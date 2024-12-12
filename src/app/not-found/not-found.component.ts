import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],
})
export class NotFoundComponent implements OnInit {
  picSrc = '../../assets/404.jpg';
  ngOnInit(): void {
    let paraTop = document.getElementById('photo-top');
    if (paraTop) {
      paraTop.style.backgroundImage = 'url(' + this.picSrc + ')';
    }
  }
}
