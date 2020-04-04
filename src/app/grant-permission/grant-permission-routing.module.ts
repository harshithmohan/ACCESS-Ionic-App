import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GrantPermissionPage } from './grant-permission.page';

const routes: Routes = [
  {
    path: '',
    component: GrantPermissionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GrantPermissionPageRoutingModule {}
