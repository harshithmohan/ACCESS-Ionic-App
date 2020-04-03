import { Component, OnInit, Input } from '@angular/core';
import { LockService } from '../services/lock.service';
import { LoadingController, PopoverController, AlertController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { BackButtonService } from '../services/back-button.service';


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
    expiryActual: null,
    expiryDisplay: null
  };
  error = '';
  currentTime = new Date().toISOString();

  constructor(
    private alertController: AlertController,
    private backButton: BackButtonService,
    private lockService: LockService,
    private loadingController: LoadingController,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
    this.backButton.setPopoverBackButton();
    this.user.lockId = this.lock.lockId;
  }

  async grantPermission() {
    if (this.user.userType === 'Guest' && this.user.expiryActual === null) {
      this.error = 'Please enter expiry date and time';
      return;
    }
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    loading.present();
    await this.lockService.grantPermission(this.user).then((rdata: any) => {
      if (rdata.status) {
        this.showGrantedAlert();
        this.popoverController.dismiss({
          reloadData: true
        });
      } else {
        this.error = rdata.content;
      }
    });
    loading.dismiss();
  }

  async showGrantedAlert() {
    this.backButton.setAlertBackButton();
    const alert = await this.alertController.create({
      header: 'Permission Granted',
      message: 'Permission for ' + this.lock.alias + ' has been granted to ' + this.user.username,
      buttons: ['OK']
    });
    alert.onDidDismiss().then(() => this.backButton.setModalBackButton());
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
  expiryActual: string;
  expiryDisplay: string;
}
