import { Component, OnInit } from '@angular/core';
import { LockService } from '../services/lock.service';
import { LoadingController } from '@ionic/angular';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';

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
    ])
  ]
})
export class OtherLocksPage implements OnInit {

  locks: LockObject;
  lockSet: Set<string>;
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
    await this.lockService.getOtherLocks().then((rdata: string) => {
      this.locks = JSON.parse(rdata);
      Object.keys(this.locks).forEach((lockId: string) => {
        this.lockSet.add(lockId);
      });
    });
  }

  async lock(lockId: string) {
    const loading = await this.loadingController.create({
      message: 'Locking ' + this.locks[lockId].alias + '...'
    });
    loading.present();
    await this.lockService.lock(lockId).then(val => {
      console.log(val);
    });
    loading.dismiss();
  }

  refreshLocks(event) {
    this.getLocks().then(() => {
      event.target.complete();
    });
  }

  async unlock(lockId: string) {
    // const loading = await this.loadingController.create({
    //   message: 'Unlocking ' + this.locks[lockId].alias + '...'
    // });
    // loading.present();
    // await this.lockService.unlock(lockId).then(val => {
    //   console.log(val);
    // });
    // loading.dismiss();
    this.router.navigateByUrl('/ble-scan/' + lockId);
  }

}

interface Lock {
  lockId: string;
  alias: string;
  address: string;
  expiry: string;
}

interface LockObject {
  [key: string]: Lock;
}
