import { Component, OnInit, Input } from '@angular/core';
import { LockService } from '../services/lock.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackButtonService } from '../services/back-button.service';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-grant-permission',
  templateUrl: './grant-permission.page.html',
  styleUrls: ['./grant-permission.page.scss'],
})
export class GrantPermissionPage implements OnInit {

  grantPermissionForm: FormGroup;
  @Input() lock: Lock;
  error = '';
  currentTime = new Date().toISOString();

  constructor(
    private alertController: AlertController,
    private backButton: BackButtonService,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private lockService: LockService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.grantPermissionForm = this.formBuilder.group({
      username: [null, Validators.required],
      userType: [null, Validators.required],
      expiry: [null]
    });
  }

  async grantPermission() {
    const permForm = this.grantPermissionForm.value;
    if (permForm.userType === 'Guest' && permForm.expiry === null) {
      this.error = 'Please enter expiry date and time';
      return;
    }
    const permission = {
      lockId: this.lock.lockId,
      username: permForm.username,
      userType: permForm.userType,
      expiryActual: permForm.expiry,
      expiryDisplay: null
    };
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    loading.present();
    await this.lockService.grantPermission(permission).then((rdata: any) => {
      if (rdata.status) {
        this.showGrantedAlert();
        this.modalController.dismiss({
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
      message: 'Permission for ' + this.lock.alias + ' has been granted to ' + this.grantPermissionForm.value.username,
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
