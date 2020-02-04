import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OtherLocksPageRoutingModule } from './other-locks-routing.module';

import { OtherLocksPage } from './other-locks.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OtherLocksPageRoutingModule
  ],
  declarations: [OtherLocksPage]
})
export class OtherLocksPageModule {}
