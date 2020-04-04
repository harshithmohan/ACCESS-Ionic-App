import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GrantPermissionPageRoutingModule } from './grant-permission-routing.module';

import { GrantPermissionPage } from './grant-permission.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    GrantPermissionPageRoutingModule
  ],
  declarations: [GrantPermissionPage]
})
export class GrantPermissionPageModule {}
