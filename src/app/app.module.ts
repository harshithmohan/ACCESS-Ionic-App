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
import { FormsModule } from '@angular/forms';

import { GrantPermissionComponent } from './grant-permission/grant-permission.component';
import { AddLockComponent } from './add-lock/add-lock.component';
import { EditLockComponent } from './edit-lock/edit-lock.component';

@NgModule({
  declarations: [
    AppComponent,
    GrantPermissionComponent,
    AddLockComponent,
    EditLockComponent
  ],
  entryComponents: [
    GrantPermissionComponent,
    AddLockComponent,
    EditLockComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot({ hardwareBackButton: false }),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [
    FingerPrintAuth,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
