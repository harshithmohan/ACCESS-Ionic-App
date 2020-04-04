import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackButtonService } from '../services/back-button.service';
import { LockService } from '../services/lock.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  changePasswordForm: FormGroup;
  error = '';

  constructor(
    private alertController: AlertController,
    private backButton: BackButtonService,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private lockService: LockService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.backButton.setModalBackButton();

    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', Validators.compose([Validators.pattern('((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,30})'), Validators.required])],
      newPassword: ['', Validators.compose([Validators.pattern('((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,30})'), Validators.required])],
      cnewPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatch('newPassword', 'cnewPassword')
    });
  }

  async changePassword() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    loading.present();
    const pForm = this.changePasswordForm.value;
    await this.lockService.changePassword(pForm.oldPassword, pForm.newPassword).then((rdata: any) => {
      if (rdata.status) {
        this.showChangedPasswordAlert();
        this.modalController.dismiss();
      } else {
        this.error = rdata.content;
      }
    });
    loading.dismiss();
  }

  passwordMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
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
