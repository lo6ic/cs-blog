import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { ResumeComponent } from './resume/resume.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
};
const routes: Routes = [
  {
    path: 'contact',
    component: ContactComponent,
    title: 'Christopher Schedler - Contact',
    data: {
      seo: {
        title: 'Christopher Schedler - Contact',
        description:
          'Contact Christopher Schedler, a software engineer specializing in Angular, TypeScript, JavaScript, and modern web development.',
        path: '/contact',
      },
    },
  },
  {
    path: 'about',
    component: AboutComponent,
    title: 'Christopher Schedler - About',
    data: {
      seo: {
        title: 'Christopher Schedler - About',
        description:
          'Learn more about Christopher Schedler, a software engineer focused on Angular, TypeScript, JavaScript, and modern front-end development.',
        path: '/about',
      },
    },
  },
  {
    path: 'resume',
    component: ResumeComponent,
    title: 'Christopher Schedler - Resume',
    data: {
      seo: {
        title: 'Christopher Schedler - Resume',
        description:
          'View Christopher Schedler’s software engineering experience, technical skills, professional background, and web development resume.',
        path: '/resume',
      },
    },
  },
  {
    path: 'blog',
    loadChildren: () => import('./blog/blog.module').then((m) => m.BlogModule),
    title: 'Christopher Schedler - Blog',
    data: {
      seo: {
        title: 'Christopher Schedler - Software Development Blog',
        description:
          'Articles by Christopher Schedler about Angular, TypeScript, JavaScript, front-end development, and modern software engineering.',
        path: '/blog',
      },
    },
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
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
