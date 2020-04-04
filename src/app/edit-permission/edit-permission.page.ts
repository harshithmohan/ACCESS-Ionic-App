import { Component, OnInit, Input } from '@angular/core';
import { LockService } from '../services/lock.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackButtonService } from '../services/back-button.service';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-permission',
  templateUrl: './edit-permission.page.html',
  styleUrls: ['./edit-permission.page.scss'],
})
export class EditPermissionPage implements OnInit {

  editPermissionForm: FormGroup;
  @Input() permission: Permission;
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
    this.backButton.setModalBackButton();
    this.editPermissionForm = this.formBuilder.group({
      username: [this.permission.username, Validators.required],
      userType: [this.permission.userType, Validators.required],
      expiry: [this.permission.expiryActual]
    });
  }

  async editPermission() {
    const permForm = this.editPermissionForm.value;
    if (permForm.userType === 'Guest' && permForm.expiryActual === null) {
      this.error = 'Please enter expiry date and time';
      return;
    }
    const permission = {
      lockId: this.permission.lockId,
      username: permForm.username,
      userType: permForm.userType,
      expiryActual: permForm.expiry,
      expiryDisplay: null
    };
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    loading.present();
    await this.lockService.editPermission(permission).then((rdata: any) => {
      if (rdata.status) {
        this.showAlert();
        this.modalController.dismiss({
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
      header: 'Permission edited!',
      message: 'Permission has been edited',
      buttons: ['OK']
    });
    alert.onDidDismiss().then(() => this.backButton.setModalBackButton());
    await alert.present();
  }

}

interface Permission {
  userType: string;
  username: string;
  name: string;
  expiryActual: string;
  expiryDisplay: string;
  lockId: string;
}
