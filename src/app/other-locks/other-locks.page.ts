import { Component, OnInit } from '@angular/core';
import { LockService } from '../services/lock.service';
import { LoadingController } from '@ionic/angular';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';

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
  expandedLockId = '';

  constructor(
    private lockService: LockService,
    private loadingController: LoadingController,
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
      }
    });
  }

  async lock(lockId: string) {
    const loading = await this.loadingController.create({
      message: 'Locking ' + this.locks[lockId].alias + '...'
    });
    loading.present();
    await this.lockService.lock(lockId);
    loading.dismiss();
  }

  async lockGuest(lockId: string) {
    this.router.navigateByUrl('/ble-scan/' + lockId + '/lock');
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

  async unlockGuest(lockId: string) {
    this.router.navigateByUrl('/ble-scan/' + lockId + '/unlock');
  }

  viewLogs(lockId: string) {
    this.router.navigate(['/logs'], { queryParams: { filter: true, lockId } });
  }

  viewPermissions(lockId: string) {
    this.router.navigateByUrl('/view-permissions/' + lockId);
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
