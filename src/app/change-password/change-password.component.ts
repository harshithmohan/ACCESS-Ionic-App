import { Component, OnInit } from '@angular/core';
import { LockService } from '../services/lock.service';
import { LoadingController, PopoverController, AlertController } from '@ionic/angular';
import { BackButtonService } from '../services/back-button.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {

  error = '';
  oldPassword = '';
  newPassword = '';
  confirmNewPassword = '';

  constructor(
    private alertController: AlertController,
    private backButton: BackButtonService,
    private lockService: LockService,
    private loadingController: LoadingController,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
    this.backButton.setPopoverBackButton();
  }

  async changePassword() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    loading.present();
    if (this.newPassword !== this.confirmNewPassword) {
      this.error = 'Passwords don\'t match!';
      loading.dismiss();
      return;
    }
    await this.lockService.changePassword(this.oldPassword, this.newPassword).then((rdata: any) => {
      if (rdata.status) {
        this.showChangedPasswordAlert();
        this.popoverController.dismiss();
      } else {
        this.error = rdata.content;
      }
    });
    loading.dismiss();
  }

  async showChangedPasswordAlert() {
    this.backButton.setAlertBackButton();
    const alert = await this.alertController.create({
      header: 'Password changed!',
      message: 'Your password has been successfully changed.',
      buttons: ['OK']
    });
    alert.onDidDismiss().then(() => this.backButton.unsetAlertBackButton());
    await alert.present();
  }
}
