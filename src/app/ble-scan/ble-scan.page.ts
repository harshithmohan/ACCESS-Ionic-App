import { Component, OnInit, Input } from '@angular/core';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LockService } from '../services/lock.service';
import { timer } from 'rxjs';
import { BackButtonService } from '../services/back-button.service';

@Component({
  selector: 'app-ble-scan',
  templateUrl: './ble-scan.page.html',
  styleUrls: ['./ble-scan.page.scss'],
})
export class BleScanPage implements OnInit {

  @Input() lockId: string;
  @Input() operation: string;
  btAddress: string;

  constructor(
    private alertController: AlertController,
    private backButton: BackButtonService,
    private ble: BluetoothLE,
    private loadingController: LoadingController,
    private lockService: LockService,
    private router: Router
  ) { }

  ngOnInit() {
    this.lockService.getBluetoothAddress(this.lockId).then((rdata: any) => {
      if (rdata.status) {
        this.btAddress = rdata.content;
        this.checkPermissions();
      }
    });
  }

  async checkPermissions() {
    let hasPermission = false;
    await this.ble.hasPermission().then(locationPermission => hasPermission = locationPermission.hasPermission);
    if (!hasPermission) {
      console.log('no perm');
      let requestPermission = false;
      await this.ble.requestPermission().then(reqPermission => requestPermission = reqPermission.requestPermission);
      if (!requestPermission) {
        this.showAlert('No location permission!', 'Cannot scan for devices without permission');
      } else {
        this.checkPermissions();
      }
    } else {
      let isLocationEnabled = false;
      console.log('not enabled');
      await this.ble.isLocationEnabled().then(locationEnabled => isLocationEnabled = locationEnabled.isLocationEnabled);
      if (!isLocationEnabled) {
        let requestLocation = false;
        await this.ble.requestLocation().then(reqLocation => requestLocation = reqLocation.requestLocation);
        this.checkPermissions();
      } else {
        this.initializeBluetooth();
      }
    }
  }

  async initializeBluetooth() {
    this.ble.initialize({ request: true }).subscribe(val => {
      console.log('BluetoothLE ' + val.status);
      this.scanDevices();
    });
  }

  async scanDevices() {
    const loading = await this.loadingController.create({
      message: 'Checking proximity ...'
    });
    loading.present();
    await this.ble.isScanning().then(val => {
      if (val.isScanning) {
        this.ble.stopScan();
      }
    });
    const timeout = timer(15000);
    timeout.subscribe(() => {
      this.ble.stopScan().then(() => {
        loading.dismiss();
        this.showUnableAuthAlert();
      });
    });
    this.ble.startScan({ services: [] }).subscribe(scan => {
      console.log(scan);
      if (scan.address === this.btAddress) {
        this.ble.close({ address: scan.address }).then(val => {
          console.log('DISCONNECT: ', val);
        }).catch();
        this.ble.stopScan();
        this.ble.connect({ address: scan.address }).subscribe(conn => {
          if (conn.status === 'connected') {
            this.ble.discover({ address: scan.address, clearCache: true }).then(device => {
              console.log(device.services[2].uuid);
              if (this.operation === 'lock') {
                this.lockService.lockGuest(this.lockId, device.services[2].uuid).then((rdata: any) => {
                  loading.dismiss();
                  if (rdata.status) {
                    this.router.navigateByUrl('/tabs/other-locks');
                  } else {
                    this.showUnableAuthAlert();
                  }
                });
              } else {
                this.lockService.unlockGuest(this.lockId, device.services[2].uuid).then((rdata: any) => {
                  loading.dismiss();
                  if (rdata.status) {
                    this.router.navigateByUrl('/tabs/other-locks');
                  } else {
                    this.showUnableAuthAlert();
                  }
                });
              }
            });
          }
        });
      }
    });
  }

  async showAlert(header: string, message: string) {
    this.backButton.setAlertBackButton();
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    alert.onDidDismiss().then(() => this.backButton.setDefaultBackButton());
    await alert.present();
  }

  async showUnableAuthAlert() {
    this.backButton.setAlertBackButton();
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Unable to authenticate. Please try again',
      buttons: [
        {
          text: 'Cancel',
          handler: () => this.router.navigateByUrl('/tabs/other-locks')
        },
        {
          text: 'Retry',
          handler: () => this.scanDevices()
        }
      ]
    });
    alert.onDidDismiss().then(() => this.backButton.setDefaultBackButton());
    await alert.present();
  }

}
