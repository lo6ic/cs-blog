import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { ContactModule } from './contact/contact.module';
import { ScullyLibModule } from '@scullyio/ng-lib';
import { ResumeModule } from './resume/resume.module';
import {
  NgxGoogleAnalyticsModule,
  provideGoogleAnalytics,
  provideGoogleAnalyticsRouter,
} from '@hakimio/ngx-google-analytics';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [AppComponent, NotFoundComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    ContactModule,
    ResumeModule,
    ScullyLibModule,
    NgxGoogleAnalyticsModule,
  ],
  providers: [
    provideGoogleAnalytics('G-KCVDBWMDT5'),
    provideGoogleAnalyticsRouter(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
