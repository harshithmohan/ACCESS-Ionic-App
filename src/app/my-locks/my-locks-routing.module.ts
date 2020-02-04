import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyLocksPage } from './my-locks.page';

const routes: Routes = [
  {
    path: '',
    component: MyLocksPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyLocksPageRoutingModule {}
