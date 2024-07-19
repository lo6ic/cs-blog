import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { ResumeComponent } from './resume/resume.component';

const routes: Routes = [
  {
    path: 'contact',
    component: ContactComponent,
    title: 'Christopher Schedler - Contact',
  },
  {
    path: 'about',
    component: AboutComponent,
    title: 'Christopher Schedler - About',
  },
  {
    path: 'resume',
    component: ResumeComponent,
    title: 'Christopher Schedler - Resume',
  },
  {
    path: 'blog',
    loadChildren: () => import('./blog/blog.module').then((m) => m.BlogModule),
    title: 'Christopher Schedler - Blog',
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'blog',
  },
  {
    path: 'posts',
    loadChildren: () =>
      import('./posts/posts.module').then((m) => m.PostsModule),
  },
  {
    path: '**',
    redirectTo: 'blog',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
