import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BleScanPageRoutingModule } from './ble-scan-routing.module';

import { BleScanPage } from './ble-scan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BleScanPageRoutingModule
  ],
  declarations: [BleScanPage]
})
export class BleScanPageModule {}
