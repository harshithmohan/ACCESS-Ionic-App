import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OtherLocksPage } from './other-locks.page';

const routes: Routes = [
  {
    path: '',
    component: OtherLocksPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OtherLocksPageRoutingModule {}
