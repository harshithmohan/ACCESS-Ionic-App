import { Component, OnInit, Input } from '@angular/core';
import { LoadingController, PopoverController, AlertController } from '@ionic/angular';
import { LockService } from '../services/lock.service';
import { BackButtonService } from '../services/back-button.service';

@Component({
  selector: 'app-edit-permission',
  templateUrl: './edit-permission.component.html',
  styleUrls: ['./edit-permission.component.scss'],
})
export class EditPermissionComponent implements OnInit {

  @Input() permission: Permission;
  error = '';
  currentTime = new Date().toISOString();

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

  async editPermission() {
    console.log('SUBMITTED');
    console.log(this.permission);
    if (this.permission.userType === 'Guest' && this.permission.expiryActual === null) {
      this.error = 'Please enter expiry date and time';
      return;
    }
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    loading.present();
    await this.lockService.editPermission(this.permission).then((rdata: any) => {
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
