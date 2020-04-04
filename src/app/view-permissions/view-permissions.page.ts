import { Component, OnInit, Input } from '@angular/core';
import { LockService } from '../services/lock.service';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { trigger, transition, style, animate } from '@angular/animations';
import { BackButtonService } from '../services/back-button.service';
import { GrantPermissionPage } from '../grant-permission/grant-permission.page';
import { EditPermissionPage } from '../edit-permission/edit-permission.page';

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
    private modalController: ModalController
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
    const modal = await this.modalController.create({
      component: EditPermissionPage,
      componentProps: { permission },
      animated: true,
      cssClass: 'auto-height',
      backdropDismiss: true,
      mode: 'ios',
      presentingElement: await this.modalController.getTop()
    });
    modal.onDidDismiss().then((data) => {
      if (data.role !== 'backdrop' && data.data.reloadData) {
        this.getPermissions();
      }
    });
    return await modal.present();
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
    const modal = await this.modalController.create({
      component: GrantPermissionPage,
      componentProps: { lock },
      animated: true,
      cssClass: 'auto-height',
      backdropDismiss: true,
      mode: 'ios',
      presentingElement: await this.modalController.getTop()
    });
    modal.onDidDismiss().then((data) => {
      if (data.role !== 'backdrop' && data.data.reloadData) {
        this.getPermissions();
      }
    });
    return await modal.present();
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
