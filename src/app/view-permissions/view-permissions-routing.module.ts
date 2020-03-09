import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewPermissionsPage } from './view-permissions.page';

const routes: Routes = [
  {
    path: '',
    component: ViewPermissionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewPermissionsPageRoutingModule {}
