import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'my-locks',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../my-locks/my-locks.module').then(m => m.MyLocksPageModule)
          }
        ]
      },
      {
        path: 'other-locks',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../other-locks/other-locks.module').then(m => m.OtherLocksPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/my-locks',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/my-locks',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
