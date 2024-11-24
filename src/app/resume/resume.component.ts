import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css'],
})
export class ResumeComponent implements OnInit {
  resumeSrc = '../../assets/resume.jpg';
  ngOnInit(): void {
    let paraTop = document.getElementById('para-top');
    if (paraTop) {
      paraTop.style.backgroundImage = 'url(' + this.resumeSrc + ')';
    }
  }
}
