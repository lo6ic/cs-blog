import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostsComponent } from './posts.component';
import { PostTitleResolver } from './post-title-resolver';

const routes: Routes = [
  {
    path: ':id',
    component: PostsComponent,
    title: PostTitleResolver,
  },
  {
    path: '**',
    component: PostsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostsRoutingModule {}
