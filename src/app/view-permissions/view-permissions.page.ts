import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LockService } from '../services/lock.service';
import { LoadingController, AlertController, PopoverController } from '@ionic/angular';
import { trigger, transition, style, animate } from '@angular/animations';
import { EditPermissionComponent } from '../edit-permission/edit-permission.component';
import { GrantPermissionComponent } from '../grant-permission/grant-permission.component';


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
  lockId = '';
  lockAlias = '';
  expandedPermission = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private lockService: LockService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
    this.getPermissions();
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
    popover.onDidDismiss().then(() => this.getPermissions());
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
    this.activatedRoute.params.subscribe(params => {
      this.lockId = params.lockId;
      this.lockService.getPermissions(this.lockId).then((rdata: any) => {
        if (rdata.status) {
          this.lockAlias = rdata.content.alias;
          this.permissions = rdata.content.details;
        }
        loading.dismiss();
      });
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
    popover.onDidDismiss().then(() => this.getPermissions());
    return await popover.present();
  }

  // async loadPermissions() {
  //   const loading = await this.loadingController.create({
  //     message: 'Please wait...'
  //   });
  //   loading.present();
  //   await this.getPermissions();
  //   loading.dismiss();
  // }

  async revokePermission(username: string) {
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
