import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditPermissionPage } from './edit-permission.page';

const routes: Routes = [
  {
    path: '',
    component: EditPermissionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditPermissionPageRoutingModule {}
