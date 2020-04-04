import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditLockPage } from './edit-lock.page';

const routes: Routes = [
  {
    path: '',
    component: EditLockPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditLockPageRoutingModule {}
