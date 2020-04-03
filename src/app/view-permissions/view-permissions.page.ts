import { Component, OnInit, Input } from '@angular/core';
import { LockService } from '../services/lock.service';
import { LoadingController, AlertController, PopoverController, ModalController } from '@ionic/angular';
import { trigger, transition, style, animate } from '@angular/animations';
import { EditPermissionComponent } from '../edit-permission/edit-permission.component';
import { GrantPermissionComponent } from '../grant-permission/grant-permission.component';
import { BackButtonService } from '../services/back-button.service';

@Component({
  selector: 'app-view-permissions',
  templateUrl: './view-permissions.page.html',
  styleUrls: ['./view-permissions.page.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('1000ms ease', style({ height: '98px', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('1000ms ease', style({ height: 0, opacity: 0 }))
      ])
    ])
  ]
})
export class ViewPermissionsPage implements OnInit {

  permissions: Array<Permission> = [];
  @Input() lockId: string;
  lockAlias = '';
  expandedPermission = '';

  constructor(
    private alertController: AlertController,
    private backButton: BackButtonService,
    private lockService: LockService,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
    this.backButton.setModalBackButton();
    this.getPermissions();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async editPermission(tempPermission: Permission) {
    const permission: any = tempPermission;
    permission.lockId = this.lockId;
    const popover = await this.popoverController.create({
      component: EditPermissionComponent,
      componentProps: { permission },
      animated: true,
      showBackdrop: true
    });
    popover.style.cssText = '--width: 80vw;';
    popover.onDidDismiss().then((data) => {
      this.backButton.setModalBackButton();
      if (data.role !== 'backdrop' && data.data.reloadData) {
        this.getPermissions();
      }
    });
    return await popover.present();
  }

  expandPermission(username: string) {
    if (this.expandedPermission === username) {
      this.expandedPermission = '';
    } else {
      this.expandedPermission = username;
    }
  }

  async getPermissions() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    loading.present();
    this.lockService.getPermissions(this.lockId).then((rdata: any) => {
      if (rdata.status) {
        this.lockAlias = rdata.content.alias;
        this.permissions = rdata.content.details;
      }
      loading.dismiss();
    });
  }

  async grantPermission() {
    const lock = {
      lockId: this.lockId,
      alias: this.lockAlias
    };
    const popover = await this.popoverController.create({
      component: GrantPermissionComponent,
      componentProps: { lock },
      animated: true,
      showBackdrop: true
    });
    popover.style.cssText = '--width: 80vw;';
    popover.onDidDismiss().then((data) => {
      this.backButton.setModalBackButton();
      if (data.role !== 'backdrop' && data.data.reloadData) {
        this.getPermissions();
      }
    });
    return await popover.present();
  }

  async revokePermission(username: string) {
    this.backButton.setAlertBackButton();
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Do you really want to revoke permission for this user?',
      buttons: [
        {
          text: 'Cancel'
        }, {
          text: 'Revoke',
          handler: () => {
            this.revokePermissionConfirm(username);
          }
        }
      ]
    });
    alert.onDidDismiss().then(() => this.backButton.setModalBackButton());
    await alert.present();
  }

  async revokePermissionConfirm(username: string) {
    const loading = await this.loadingController.create({
      message: 'Revoking permission...'
    });
    loading.present();
    await this.lockService.revokePermission(this.lockId, username).then(() => {
      loading.dismiss();
      this.getPermissions();
    });
  }

}

interface Permission {
  userType: string;
  username: string;
  name: string;
  expiryDisplay: string;
  expiryActual: string;
}
