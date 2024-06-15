import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [
  { path: 'contact', component: ContactComponent },
  {
    path: 'blog',
    loadChildren: () => import('./blog/blog.module').then((m) => m.BlogModule),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'blog',
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
