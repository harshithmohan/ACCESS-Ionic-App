import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddLockPage } from './add-lock.page';

const routes: Routes = [
  {
    path: '',
    component: AddLockPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddLockPageRoutingModule {}
