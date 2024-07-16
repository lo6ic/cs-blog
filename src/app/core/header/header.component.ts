import { Component } from '@angular/core';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  themeSwitch() {
    let htmlContainer = document.getElementById('oHTML');
    let nowTheme = htmlContainer?.getAttribute('data-bs-theme');
    if (nowTheme == 'dark') {
      htmlContainer?.setAttribute('data-bs-theme', 'light');
    } else {
      htmlContainer?.setAttribute('data-bs-theme', 'dark');
    }
  }
}
