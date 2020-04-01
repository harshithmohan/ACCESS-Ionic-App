import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'my-locks',
    loadChildren: () => import('./my-locks/my-locks.module').then( m => m.MyLocksPageModule)
  },
  {
    path: 'other-locks',
    loadChildren: () => import('./other-locks/other-locks.module').then( m => m.OtherLocksPageModule)
  },
  {
    path: 'logs',
    loadChildren: () => import('./logs/logs.module').then( m => m.LogsPageModule)
  },
  {
    path: 'view-permissions/:lockId',
    loadChildren: () => import('./view-permissions/view-permissions.module').then( m => m.ViewPermissionsPageModule)
  },
  {
    path: 'ble-scan/:lockId/:operation',
    loadChildren: () => import('./ble-scan/ble-scan.module').then( m => m.BleScanPageModule)
  },
  {
    path: 'how-to-use',
    loadChildren: () => import('./how-to-use/how-to-use.module').then( m => m.HowToUsePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
