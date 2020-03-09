import { Component, OnInit, Input } from '@angular/core';
import { LoadingController, PopoverController, AlertController } from '@ionic/angular';
import { LockService } from '../services/lock.service';

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
    private loadingController: LoadingController,
    private lockService: LockService,
    private popoverController: PopoverController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    console.log(this.permission);
  }

  async editPermission() {
    console.log('SUBMITTED');
    console.log(this.permission);
    if (this.permission.userType === 'Guest' && this.permission.expiry === null) {
      this.error = 'Please enter expiry date and time';
      return;
    }
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    loading.present();
    await this.lockService.editPermission(this.permission).then(rdata => {
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
      header: 'Permission edited!',
      message: 'Permission has been edited',
      buttons: ['OK']
    });

    await alert.present();
  }

}

interface Permission {
  userType: string;
  username: string;
  name: string;
  expiry: string;
  lockId: string;
}