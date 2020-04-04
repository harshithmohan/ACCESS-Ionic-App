import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditLockPageRoutingModule } from './edit-lock-routing.module';

import { EditLockPage } from './edit-lock.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditLockPageRoutingModule
  ],
  declarations: [EditLockPage]
})
export class EditLockPageModule {}
