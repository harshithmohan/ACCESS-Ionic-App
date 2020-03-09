import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewPermissionsPageRoutingModule } from './view-permissions-routing.module';

import { ViewPermissionsPage } from './view-permissions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewPermissionsPageRoutingModule
  ],
  declarations: [ViewPermissionsPage]
})
export class ViewPermissionsPageModule {}
