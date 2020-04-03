import { Component, OnInit } from '@angular/core';
import { LockService } from '../services/lock.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { BackButtonService } from '../services/back-button.service';
import { ViewPermissionsPage } from '../view-permissions/view-permissions.page';
import { BleScanPage } from '../ble-scan/ble-scan.page';

const { Browser } = Plugins;

@Component({
  selector: 'app-other-locks',
  templateUrl: './other-locks.page.html',
  styleUrls: ['./other-locks.page.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('500ms ease', style({ height: '48px', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('500ms ease', style({ height: 0, opacity: 0 }))
      ])
    ]),
    trigger('inOutOwnerAnimation', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('500ms ease', style({ height: '194px', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('500ms ease', style({ height: 0, opacity: 0 }))
      ])
    ])
  ]
})
export class OtherLocksPage implements OnInit {

  locks: LockObject;
  lockSet: Set<string>;
  lockOwnerSet: Set<string>;
  lockSetEmpty = true;
  lockOwnerSetEmpty = true;
  expandedLockId = '';

  constructor(
    private backButton: BackButtonService,
    private loadingController: LoadingController,
    private lockService: LockService,
    private modalController: ModalController,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadLocks();
  }

  expandLock(lockId: string) {
    if (this.expandedLockId === lockId) {
      this.expandedLockId = '';
    } else {
      this.expandedLockId = lockId;
    }
  }

  async loadLocks() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    loading.present();
    await this.getLocks();
    loading.dismiss();
  }

  async getLocks() {
    this.lockSet = new Set();
    this.lockOwnerSet = new Set();
    await this.lockService.getOtherLocks().then((rdata: any) => {
      if (rdata.status) {
        this.locks = rdata.content;
        Object.keys(this.locks).forEach((lockId: string) => {
          if (this.locks[lockId].userType === 'Owner') {
            this.lockOwnerSet.add(lockId);
          } else {
            this.lockSet.add(lockId);
          }
        });
        if (this.lockSet.size > 0) {
          this.lockSetEmpty = false;
        }
        if (this.lockOwnerSet.size > 0) {
          this.lockOwnerSetEmpty = false;
        }
      }
    });
  }

  async guestLockOperations(lockId: string, operation: string) {
    const modal = await this.modalController.create({
      component: BleScanPage,
      animated: true,
      componentProps: {
        lockId,
        operation
      }
    });
    return await modal.present();
  }

  async lock(lockId: string) {
    const loading = await this.loadingController.create({
      message: 'Locking ' + this.locks[lockId].alias + '...'
    });
    loading.present();
    await this.lockService.lock(lockId);
    loading.dismiss();
  }

  refreshLocks(event) {
    this.getLocks().then(() => {
      event.target.complete();
    });
  }

  async startWebcam(lockId: string) {
    await Browser.open({ url: 'https://mohan226.ddns.net:8080/' });
  }

  async unlock(lockId: string) {
    const loading = await this.loadingController.create({
      message: 'Unlocking ' + this.locks[lockId].alias + '...'
    });
    loading.present();
    await this.lockService.unlock(lockId);
    loading.dismiss();
  }

  viewLogs(lockId: string) {
    this.router.navigate(['/logs'], { queryParams: { filter: true, lockId } });
  }

  async viewPermissions(lockId: string) {
    const modal = await this.modalController.create({
      component: ViewPermissionsPage,
      animated: true,
      componentProps: {
        lockId
      }
    });
    modal.onDidDismiss().then(() => this.backButton.setDefaultBackButton());
    return await modal.present();
  }

}

interface Lock {
  lockId: string;
  alias: string;
  address: string;
  expiry: string;
  userType: string;
}

interface LockObject {
  [key: string]: Lock;
}
