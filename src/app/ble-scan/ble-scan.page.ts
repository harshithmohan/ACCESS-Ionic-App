import { Component, OnInit } from '@angular/core';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { AlertController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { LockService } from '../services/lock.service';

@Component({
  selector: 'app-ble-scan',
  templateUrl: './ble-scan.page.html',
  styleUrls: ['./ble-scan.page.scss'],
})
export class BleScanPage implements OnInit {

  lockId: string;
  bleUUID: string;
  btAddress: string;

  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ble: BluetoothLE,
    private lockService: LockService
  ) { }

  ngOnInit() {
    // this.checkPermissions();
    this.activatedRoute.params.subscribe(params => {
      this.lockId = params.lockId;
      this.lockService.getBluetoothDetails(this.lockId).then((rdata: string) => {
        console.log(rdata);
        // const data = JSON.parse(rdata);
        // this.bleUUID = data.bleUUID;
        // this.btAddress = data.btAddress;
        this.btAddress = 'B8:27:EB:3B:5B:C3';
        // this.btAddress = '90:78:41:6F:2D:53';
        console.log(this.bleUUID);
        console.log(this.btAddress);
        this.checkPermissions();
      });
    });
  }

  async checkPermissions() {
    let hasPermission = false;
    await this.ble.hasPermission().then(locationPermission => hasPermission = locationPermission.hasPermission);
    if (!hasPermission) {
      let requestPermission = false;
      await this.ble.requestPermission().then(reqPermission => requestPermission = reqPermission.requestPermission);
      if (!requestPermission) {
        this.showAlert('No location permission!', 'Cannot scan for devices without permission');
      }
    } else {
      let isLocationEnabled = false;
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

  async scanDevices() {
    // await this.ble.stopScan();
    const loading = await this.loadingController.create({
      message: 'Unlocking ...'
    });
    loading.present();
    await this.ble.isScanning().then(val => {
      if (val.isScanning) {
        this.ble.stopScan();
      }
    });
    this.ble.startScan({ services: [] }).subscribe(scan => {
      console.log(scan);
      if (scan.address === this.btAddress) {
        // this.ble.close({ address: '90:78:41:6F:2D:53' }).then(val => {
        //   console.log('DISCONNECT: ', val);
        // });
        this.ble.stopScan();
        this.unlock();
        loading.dismiss();
        // this.ble.connect({ address: scan.address }).subscribe(conn => {
        //   if (conn.status === 'connected') {
        //     this.ble.discover({ address: scan.address, clearCache: true }).then(device => {
        //       console.log(device);
        //     });
        //   }
        // });
      }
    });
  }

  async initializeBluetooth() {
    this.ble.initialize({ request: true }).subscribe(val => {
      console.log('BluetoothLE ' + val.status);
      this.scanDevices();
    });
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async unlock() {
    const loading = await this.loadingController.create({
      message: 'Unlocking ...'
    });
    loading.present();
    await this.lockService.unlock(this.lockId).then(val => {
      console.log(val);
      this.router.navigateByUrl('/tabs');
    });
    loading.dismiss();
  }

}
