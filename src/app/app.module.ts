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

import { GrantPermissionComponent } from './grant-permission/grant-permission.component';
import { EditPermissionComponent } from './edit-permission/edit-permission.component';
import { AddLockComponent } from './add-lock/add-lock.component';
import { EditLockComponent } from './edit-lock/edit-lock.component';
import { LogsFilterComponent } from './logs-filter/logs-filter.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  declarations: [
    AppComponent,
    GrantPermissionComponent,
    EditPermissionComponent,
    AddLockComponent,
    EditLockComponent,
    LogsFilterComponent,
    ChangePasswordComponent
  ],
  entryComponents: [
    GrantPermissionComponent,
    EditPermissionComponent,
    AddLockComponent,
    EditLockComponent,
    LogsFilterComponent,
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot({ hardwareBackButton: false }),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    FingerPrintAuth,
    BluetoothLE,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
