import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';

import { FingerPrintAuth } from 'capacitor-fingerprint-auth';
import { IonicStorageModule } from '@ionic/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';

import { LogsFilterComponent } from './logs-filter/logs-filter.component';
import { LogsImagesComponent } from './logs-images/logs-images.component';

import { ViewPermissionsPageModule } from './view-permissions/view-permissions.module';
import { BleScanPageModule } from './ble-scan/ble-scan.module';
import { AddLockPageModule } from './add-lock/add-lock.module';
import { EditLockPageModule } from './edit-lock/edit-lock.module';
import { GrantPermissionPageModule } from './grant-permission/grant-permission.module';
import { EditPermissionPageModule } from './edit-permission/edit-permission.module';
import { ChangePasswordPageModule } from './change-password/change-password.module';

@NgModule({
  declarations: [
    AppComponent,
    LogsFilterComponent,
    LogsImagesComponent
  ],
  entryComponents: [
    LogsFilterComponent,
    LogsImagesComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot({ hardwareBackButton: false }),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ViewPermissionsPageModule,
    BleScanPageModule,
    AddLockPageModule,
    EditLockPageModule,
    GrantPermissionPageModule,
    EditPermissionPageModule,
    ChangePasswordPageModule
  ],
  providers: [
    FingerPrintAuth,
    BluetoothLE,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
