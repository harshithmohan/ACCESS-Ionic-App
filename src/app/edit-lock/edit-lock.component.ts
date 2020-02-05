import { Component, OnInit, Input } from '@angular/core';
import { LoadingController, PopoverController, AlertController } from '@ionic/angular';
import { LockService } from '../services/lock.service';

@Component({
  selector: 'app-edit-lock',
  templateUrl: './edit-lock.component.html',
  styleUrls: ['./edit-lock.component.scss'],
})
export class EditLockComponent implements OnInit {

  @Input() lock: Lock;
  error = '';

  constructor(
    private loadingController: LoadingController,
    private popoverController: PopoverController,
    private alertController: AlertController,
    private lockService: LockService
  ) { }

  ngOnInit() {}

  async editLock() {
    console.log('SUBMITTED');
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    loading.present();
    this.lockService.editLock(this.lock.lockId, this.lock.alias, this.lock.address).then(rdata => {
      if (rdata === 'true') {
        this.showAlert();
        this.popoverController.dismiss();
      } else {
        this.error = rdata;
      }
    });
    loading.dismiss();
  }

  async showAlert() {
    const alert = await this.alertController.create({
      header: 'Lock edited!',
      message: 'Lock has been edited',
      buttons: ['OK']
    });

    await alert.present();
  }

}

interface Lock {
  lockId: string;
  alias: string;
  address: string;
  favourite: boolean;
}
