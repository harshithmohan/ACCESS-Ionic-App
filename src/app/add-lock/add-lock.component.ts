import { Component, OnInit } from '@angular/core';
import { LockService } from '../services/lock.service';
import { LoadingController, AlertController, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-lock',
  templateUrl: './add-lock.component.html',
  styleUrls: ['./add-lock.component.scss'],
})
export class AddLockComponent implements OnInit {

  lockId = '';
  alias = '';
  address = '';
  webcam = false;
  error = '';

  constructor(
    private loadingController: LoadingController,
    private alertController: AlertController,
    private lockService: LockService,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {}

  async addLock() {
    console.log('SUBMITTED');
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    loading.present();
    await this.lockService.addLock(this.lockId).then((rdata: any) => {
      if (rdata.status) {
        this.lockService.editLock(this.lockId, this.alias, this.address, this.webcam).then((rdata2: any) => {
          if (rdata2.status) {
            this.showAlert();
            this.popoverController.dismiss();
          } else {
            this.error = rdata2.content;
          }
        });
      } else {
        this.error = rdata.content;
      }
    });
    loading.dismiss();
  }

  async showAlert() {
    const alert = await this.alertController.create({
      header: 'Lock added!',
      message: 'Lock ' + this.lockId + ' has been registered with your account',
      buttons: ['OK']
    });

    await alert.present();
  }

}
