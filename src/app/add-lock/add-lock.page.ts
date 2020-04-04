import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { BackButtonService } from '../services/back-button.service';
import { LockService } from '../services/lock.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-lock',
  templateUrl: './add-lock.page.html',
  styleUrls: ['./add-lock.page.scss'],
})
export class AddLockPage implements OnInit {

  error = '';
  addLockForm: FormGroup;

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

    this.addLockForm = this.formBuilder.group({
      lockId: ['', Validators.required],
      alias: ['', Validators.required],
      address: ['', Validators.required],
      webcam: [false, Validators.required]
    });
  }

  async addLock() {
    console.log('SUBMITTED');
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    loading.present();
    const lockForm = this.addLockForm.value;
    await this.lockService.addLock(lockForm.lockId).then((rdata: any) => {
      if (rdata.status) {
        this.lockService.editLock(lockForm.lockId, lockForm.alias, lockForm.address, lockForm.webcam).then((rdata2: any) => {
          if (rdata2.status) {
            this.showAlert();
            this.modalController.dismiss({
              reloadData: true
            });
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
    this.backButton.setAlertBackButton();
    const alert = await this.alertController.create({
      header: 'Lock added!',
      message: 'Lock ' + this.addLockForm.value.lockId + ' has been registered with your account',
      buttons: ['OK']
    });
    alert.onDidDismiss().then(() => this.backButton.setDefaultBackButton());
    await alert.present();
  }

}
