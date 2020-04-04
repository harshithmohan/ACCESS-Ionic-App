import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddLockPageRoutingModule } from './add-lock-routing.module';

import { AddLockPage } from './add-lock.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddLockPageRoutingModule
  ],
  declarations: [AddLockPage]
})
export class AddLockPageModule {}
