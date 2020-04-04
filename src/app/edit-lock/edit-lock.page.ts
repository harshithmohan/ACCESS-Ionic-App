import { Component, OnInit, Input } from '@angular/core';
import { BackButtonService } from '../services/back-button.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LockService } from '../services/lock.service';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-lock',
  templateUrl: './edit-lock.page.html',
  styleUrls: ['./edit-lock.page.scss'],
})
export class EditLockPage implements OnInit {

  editLockForm: FormGroup;
  @Input() lock: Lock;
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

    this.editLockForm = this.formBuilder.group({
      alias: [this.lock.alias, Validators.required],
      address: [this.lock.address, Validators.required],
      webcam: [this.lock.webcam, Validators.required]
    });
  }

  async editLock() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    loading.present();
    const lockForm = this.editLockForm.value;
    this.lockService.editLock(this.lock.lockId, lockForm.alias, lockForm.address, lockForm.webcam).then((rdata: any) => {
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
