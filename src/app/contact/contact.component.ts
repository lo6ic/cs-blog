import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  contactSrc = '../../assets/contact.jpg';
  ngOnInit(): void {
    let paraTop = document.getElementById('para-top');
    if (paraTop) {
      paraTop.style.backgroundImage = 'url(' + this.contactSrc + ')';
    }
  }
}
