import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BleScanPage } from './ble-scan.page';

const routes: Routes = [
  {
    path: '',
    component: BleScanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BleScanPageRoutingModule {}
