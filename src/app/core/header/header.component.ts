import { Component } from '@angular/core';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  themeSwitch() {
    let htmlContainer = document.getElementById('oHTML');
    let nowTheme = htmlContainer?.getAttribute('data-theme');
    if (nowTheme == 'dark') {
      htmlContainer?.setAttribute('data-theme', 'light');
    } else {
      htmlContainer?.setAttribute('data-theme', 'dark');
    }
  }
}
