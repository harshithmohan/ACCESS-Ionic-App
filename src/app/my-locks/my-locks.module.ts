import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyLocksPageRoutingModule } from './my-locks-routing.module';

import { MyLocksPage } from './my-locks.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyLocksPageRoutingModule
  ],
  declarations: [MyLocksPage]
})
export class MyLocksPageModule {}
