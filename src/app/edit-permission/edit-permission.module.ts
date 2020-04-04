import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditPermissionPageRoutingModule } from './edit-permission-routing.module';

import { EditPermissionPage } from './edit-permission.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditPermissionPageRoutingModule
  ],
  declarations: [EditPermissionPage]
})
export class EditPermissionPageModule {}
