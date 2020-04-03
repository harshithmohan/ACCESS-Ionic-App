import { Component, OnInit, Input } from '@angular/core';
import { LoadingController, PopoverController, AlertController } from '@ionic/angular';
import { LockService } from '../services/lock.service';
import { BackButtonService } from '../services/back-button.service';

@Component({
  selector: 'app-edit-lock',
  templateUrl: './edit-lock.component.html',
  styleUrls: ['./edit-lock.component.scss'],
})
export class EditLockComponent implements OnInit {

  @Input() lock: Lock;
  error = '';

  constructor(
    private alertController: AlertController,
    private backButton: BackButtonService,
    private loadingController: LoadingController,
    private lockService: LockService,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
    this.backButton.setPopoverBackButton();
  }

  async editLock() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    loading.present();
    this.lockService.editLock(this.lock.lockId, this.lock.alias, this.lock.address, this.lock.webcam).then((rdata: any) => {
      if (rdata.status) {
        this.showAlert();
        this.popoverController.dismiss({
          reloadData: true
        });
      } else {
        this.error = rdata.content;
      }
    });
    loading.dismiss();
  }

  async showAlert() {
    this.backButton.setAlertBackButton();
    const alert = await this.alertController.create({
      header: 'Lock edited!',
      message: 'Lock has been edited',
      buttons: ['OK']
    });
    alert.onDidDismiss().then(() => this.backButton.setDefaultBackButton());
    await alert.present();
  }

}

interface Lock {
  lockId: string;
  alias: string;
  address: string;
  favourite: boolean;
  webcam: boolean;
}
