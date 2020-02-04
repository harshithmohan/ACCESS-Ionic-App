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

@NgModule({
  declarations: [
    AppComponent,
    GrantPermissionComponent
  ],
  entryComponents: [
    GrantPermissionComponent
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
