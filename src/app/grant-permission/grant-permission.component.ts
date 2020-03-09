import { Component, OnInit, Input } from '@angular/core';
import { LockService } from '../services/lock.service';
import { LoadingController, PopoverController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-grant-permission',
  templateUrl: './grant-permission.component.html',
  styleUrls: ['./grant-permission.component.scss'],
})
export class GrantPermissionComponent implements OnInit {

  @Input() lock: Lock;
  user: GrantPermissionDetails = {
    lockId: '',
    username: '',
    userType: '',
    expiry: null
  };
  error = '';
  currentTime = new Date().toISOString();

  constructor(
    private lockService: LockService,
    private loadingController: LoadingController,
    private popoverController: PopoverController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.user.lockId = this.lock.lockId;
  }

  async grantPermission() {
    console.log('SUBMITTED');
    if (this.user.userType === 'Guest' && this.user.expiry === null) {
      this.error = 'Please enter expiry date and time';
      return;
    }
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    loading.present();
    await this.lockService.grantPermission(this.user).then(rdata => {
      if (rdata === 'true') {
        this.showGrantedAlert();
        this.popoverController.dismiss();
      } else {
        this.error = rdata;
      }
    });
    loading.dismiss();
  }

  async showGrantedAlert() {
    const alert = await this.alertController.create({
      header: 'Permission Granted',
      message: 'Permission for ' + this.lock.alias + ' has been granted to ' + this.user.username,
      buttons: ['OK']
    });

    await alert.present();
  }

}

interface Lock {
  lockId: string;
  alias: string;
}

interface GrantPermissionDetails {
  lockId: string;
  username: string;
  userType: string;
  expiry: string;
}
